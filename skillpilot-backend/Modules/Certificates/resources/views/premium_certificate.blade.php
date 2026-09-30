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
            font-family: 'Times-Roman', serif;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            color: #1a1a1a;
        }
        .outer-border {
            position: absolute;
            top: 20px;
            left: 20px;
            right: 20px;
            bottom: 20px;
            border: 2px solid {{ $brand_color }};
        }
        .inner-border {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 4px double {{ $brand_color }};
        }
        .content {
            padding: 80px;
            text-align: center;
        }
        .logo-container {
            height: 100px;
            margin-bottom: 30px;
        }
        .logo {
            max-height: 80px;
        }
        .certificate-title {
            font-size: 54px;
            font-weight: bold;
            color: #1a1a1a;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 20px;
        }
        .decorative-line {
            width: 400px;
            height: 1px;
            background: linear-gradient(to right, transparent, {{ $brand_color }}, transparent);
            margin: 0 auto 30px;
        }
        .certification-text {
            font-size: 20px;
            color: #666;
            margin-bottom: 20px;
            font-style: italic;
        }
        .student-name {
            font-size: 48px;
            color: {{ $brand_color }};
            margin-bottom: 30px;
            font-family: 'Times-BoldItalic', serif;
            text-decoration: underline;
        }
        .course-details {
            font-size: 22px;
            color: #444;
            margin-bottom: 10px;
        }
        .course-title {
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 60px;
        }
        .footer {
            width: 80%;
            margin: 0 auto;
        }
        .footer-table {
            width: 100%;
            border-collapse: collapse;
        }
        .signature-cell {
            width: 33%;
            text-align: center;
            vertical-align: bottom;
        }
        .signature-img {
            max-height: 70px;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
        }
        .footer-label {
            font-size: 14px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .seal-container {
            position: absolute;
            bottom: 80px;
            left: 50%;
            margin-left: -50px;
        }
        .seal {
            width: 100px;
            opacity: 0.8;
        }
        .cert-id {
            position: absolute;
            bottom: 40px;
            right: 60px;
            font-size: 10px;
            color: #aaa;
            font-family: 'Courier', monospace;
        }
    </style>
</head>
<body>
    <div class="outer-border">
        <div class="inner-border">
            <div class="content">
                <div class="logo-container">
                    @if($logo_data)
                        <img src="{{ $logo_data }}" class="logo" alt="Logo">
                    @endif
                </div>

                <div class="certificate-title">Diploma</div>
                <div class="decorative-line"></div>

                <div class="certification-text">This high-distinction certificate is proudly presented to</div>
                <div class="student-name">{{ $user_name }}</div>

                <div class="certification-text">in recognition of successful completion and mastery of</div>
                <div class="course-title">{{ $course_title }}</div>

                <div class="footer">
                    <table class="footer-table">
                        <tr>
                            <td class="signature-cell" style="text-align: left;">
                                <div style="font-size: 16px; font-weight: bold; margin-bottom: 15px;">{{ $issued_at }}</div>
                                <div class="footer-label">Date of Attestation</div>
                            </td>
                            <td class="signature-cell" style="width: 34%;">
                                <!-- Space for Seal if added later -->
                            </td>
                            <td class="signature-cell" style="text-align: right;">
                                @if($signature_data)
                                    <img src="{{ $signature_data }}" class="signature-img" alt="Signature">
                                @else
                                    <div style="height: 70px; border-bottom: 1px solid #ccc; margin-bottom: 10px;"></div>
                                @endif
                                <div style="font-size: 16px; font-weight: bold;">Executive Director</div>
                                <div class="footer-label">SkillPilot Academy</div>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="cert-id">
                    CERTIFICATE AUTHENTICITY CODE: {{ $certificate_no }}<br>
                    VERIFIED AT: WWW.SKILLPILOT.IO/VERIFY
                </div>
            </div>
        </div>
    </div>
</body>
</html>
