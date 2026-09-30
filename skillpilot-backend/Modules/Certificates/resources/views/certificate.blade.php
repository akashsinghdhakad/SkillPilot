<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background-color: #f8fafc;
            margin: 0;
            padding: 40px;
        }
        .certificate-container {
            border: 20px solid {{ $brand_color }};
            background-color: white;
            padding: 60px;
            text-align: center;
            height: 480px;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        .certificate-border-inner {
            border: 2px solid {{ $brand_color }};
            height: 100%;
            padding: 20px;
        }
        .header {
            margin-bottom: 40px;
        }
        .logo {
            max-height: 80px;
            margin-bottom: 20px;
        }
        .title {
            font-size: 48px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 4px;
        }
        .subtitle {
            font-size: 18px;
            color: #64748b;
            margin-bottom: 40px;
        }
        .student-name {
            font-size: 42px;
            font-family: 'Times New Roman', serif;
            font-style: italic;
            color: {{ $brand_color }};
            border-bottom: 2px solid #e2e8f0;
            display: inline-block;
            padding: 0 40px;
            margin-bottom: 20px;
        }
        .course-text {
            font-size: 20px;
            color: #475569;
            margin-bottom: 10px;
        }
        .course-name {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 40px;
        }
        .footer {
            position: absolute;
            bottom: 60px;
            left: 100px;
            right: 100px;
            display: table;
            width: calc(100% - 200px);
        }
        .footer-col {
            display: table-cell;
            vertical-align: bottom;
            text-align: center;
        }
        .signature-img {
            max-height: 60px;
            border-bottom: 1px solid #1e293b;
            margin-bottom: 10px;
        }
        .footer-label {
            font-size: 12px;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .cert-info {
            position: absolute;
            bottom: 20px;
            right: 40px;
            font-size: 10px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="certificate-container">
        <div class="certificate-border-inner">
            <div class="header">
                @if($logo_url)
                    <img src="{{ $logo_url }}" class="logo" alt="Logo">
                @endif
                <div class="title">Certificate of Completion</div>
                <div class="subtitle">This is to certify that</div>
            </div>

            <div class="student-name">{{ $user_name }}</div>

            <div class="course-text">has successfully completed the professional course</div>
            <div class="course-name">{{ $course_title }}</div>

            <div class="footer">
                <div class="footer-col" style="text-align: left;">
                    <div style="font-size: 14px; font-weight: bold;">{{ $issued_at }}</div>
                    <div class="footer-label">Date of Issue</div>
                </div>
                <div class="footer-col" style="text-align: right;">
                    @if($signature_url)
                        <img src="{{ $signature_url }}" class="signature-img" alt="Signature">
                    @endif
                    <div style="font-size: 14px; font-weight: bold;">Course Director</div>
                    <div class="footer-label">Authorized Signature</div>
                </div>
            </div>

            <div class="cert-info">
                ID: {{ $certificate_no }} | Verified at skillpilot.com/verify
            </div>
        </div>
    </div>
</body>
</html>
