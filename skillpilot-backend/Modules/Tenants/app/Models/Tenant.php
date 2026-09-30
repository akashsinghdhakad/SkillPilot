<?php

namespace Modules\Tenants\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'slug', 
        'status', 
        'certificate_logo_path', 
        'certificate_signature_path', 
        'brand_color',
        'support_email',
        'billing_address',
        'tax_id'
    ];

    public function getCertificateLogoUrlAttribute()
    {
        if (!$this->certificate_logo_path || !str_starts_with($this->certificate_logo_path, 'branding/')) {
            return asset('images/default-logo.png');
        }

        return asset('storage/' . $this->certificate_logo_path);
    }

    public function getCertificateSignatureUrlAttribute()
    {
        if (!$this->certificate_signature_path || !str_starts_with($this->certificate_signature_path, 'branding/')) {
            return null;
        }

        return asset('storage/' . $this->certificate_signature_path);
    }

    public function users()
    {
        return $this->hasMany(\App\Models\User::class, 'tenant_id');
    }

    public function courses()
    {
        return $this->hasMany(\Modules\Courses\app\Models\Course::class, 'tenant_id');
    }

    public function licenses()
    {
        return $this->hasMany(\Modules\Licenses\app\Models\License::class, 'tenant_id');
    }
}
