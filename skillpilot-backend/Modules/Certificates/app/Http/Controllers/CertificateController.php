<?php

namespace Modules\Certificates\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Modules\Certificates\Models\Certificate;
use Modules\Enrollments\Models\LessonProgress;
use Modules\Courses\Models\Course;
use Modules\Assessments\Models\Quiz;
use Modules\Assessments\Models\QuizAttempt;
use Modules\Tenants\Models\Tenant;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CertificateController extends Controller
{
    /**
     * List certificates of the authenticated user.
     */
    public function index(Request $request)
    {
        $certificates = Certificate::with('course')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($certificates);
    }

    /**
     * Get a specific certificate.
     */
    public function show($id)
    {
        $certificate = Certificate::with(['user', 'course'])->findOrFail($id);
        return response()->json($certificate);
    }

    /**
     * Issue a certificate for a user who completed a course.
     */
    public function issue(Request $request)
    {
        $request->validate([
            'course_id' => 'required|integer|exists:courses,id',
        ]);

        $user = $request->user();
        $courseId = $request->course_id;
        $course = Course::findOrFail($courseId);

        // 1. Check if already issued
        $existing = Certificate::where('user_id', $user->id)->where('course_id', $courseId)->first();
        if ($existing) {
            return response()->json($existing);
        }

        // 2. Verify 100% Lesson Completion
        $lessonIds = $course->lessons()->pluck('course_lessons.id');
        $totalLessons = $lessonIds->count();
        $completedLessons = LessonProgress::where('user_id', $user->id)
            ->whereIn('lesson_id', $lessonIds)
            ->where('is_completed', true)
            ->count();

        if ($completedLessons < $totalLessons || $totalLessons === 0) {
            return response()->json([
                'message' => 'Course lessons are not fully completed.',
                'completed' => $completedLessons,
                'total' => $totalLessons
            ], 403);
        }

        // 3. Verify Final Quiz Passing (if quiz exists)
        $quiz = Quiz::where('course_id', $courseId)->first();
        if ($quiz) {
            $lastPassedAttempt = QuizAttempt::where('user_id', $user->id)
                ->where('quiz_id', $quiz->id)
                ->where('score', '>=', $quiz->passing_score)
                ->first();

            if (!$lastPassedAttempt) {
                return response()->json([
                    'message' => 'The final assessment has not been passed yet.',
                    'passing_score' => $quiz->passing_score
                ], 403);
            }
        }

        // 4. Issue the certificate
        $certificate = Certificate::create([
            'user_id'   => $user->id,
            'course_id' => $courseId,
        ]);

        return response()->json($certificate, 201);
    }

    /**
     * Download a certificate as PDF.
     */
    public function download(Request $request, $id)
    {
        $certificate = Certificate::with(['user', 'course'])->findOrFail($id);

        if ($certificate->user_id !== Auth::id() && Auth::user()->role !== 'admin') {
            abort(403, 'Unauthorized access to certificate.');
        }

        $tenant = Tenant::findOrFail($certificate->user->tenant_id);

        $data = [
            'user_name'      => $certificate->user->name,
            'course_title'   => $certificate->course->title,
            'certificate_no' => $certificate->certificate_no,
            'issued_at'      => $certificate->issued_at->format('F d, Y'),
            'logo_data'      => $this->getImageData($tenant->certificate_logo_path),
            'signature_data' => $this->getImageData($tenant->certificate_signature_path),
            'brand_color'    => $tenant->brand_color,
        ];

        $pdf = Pdf::loadView('certificates::premium_certificate', $data);
        
        return $pdf->download("Certificate-{$certificate->certificate_no}.pdf");
    }

    /**
     * Generate a live preview of the certificate for administrators.
     */
    public function preview(Request $request)
    {
        $tenant = Tenant::findOrFail($request->user()->tenant_id);
        
        // Use provided preview data or fallback to tenant defaults
        $data = [
            'user_name'      => $request->input('user_name', 'John Alexander Doe'),
            'course_title'   => $request->input('course_title', 'Advanced Skill Management'),
            'certificate_no' => 'PREVIEW-XXXX',
            'issued_at'      => now()->format('F d, Y'),
            'brand_color'    => $request->input('brand_color', $tenant->brand_color),
            'logo_data'      => $this->getImageData($tenant->certificate_logo_path),
            'signature_data' => $this->getImageData($tenant->certificate_signature_path),
        ];

        // If files are uploaded in the preview request, use them
        if ($request->hasFile('logo')) {
            $data['logo_data'] = $this->fileToBase64($request->file('logo'));
        }
        if ($request->hasFile('signature')) {
            $data['signature_data'] = $this->fileToBase64($request->file('signature'));
        }

        $pdf = Pdf::loadView('certificates::premium_certificate', $data);
        
        return $pdf->stream('preview.pdf');
    }

    /**
     * Convert uploaded file to base64 for real-time previewing.
     */
    private function fileToBase64($file)
    {
        $type = $file->getClientOriginalExtension();
        $data = file_get_contents($file->getRealPath());
        return 'data:image/' . $type . ';base64,' . base64_encode($data);
    }

    /**
     * Convert image path to base64 for PDF embedding.
     */
    private function getImageData($path)
    {
        if (!$path) return null;

        // OWASP Fix: Strict Path Sandboxing
        // Ensure the path starts with 'branding/' to prevent Local File Inclusion (LFI)
        if (!str_starts_with($path, 'branding/')) {
            \Log::warning("Unauthorized certificate asset access attempt: {$path}");
            return null;
        }

        if (!Storage::disk('public')->exists($path)) {
            return null;
        }

        try {
            $data = Storage::disk('public')->get($path);
            $type = pathinfo($path, PATHINFO_EXTENSION);
            return 'data:image/' . $type . ';base64,' . base64_encode($data);
        } catch (\Exception $e) {
            \Log::error("Failed to read certificate asset: {$path}. Error: " . $e->getMessage());
            return null;
        }
    }
}
