<?php

namespace App\Policies;

use App\Models\Iceman;
use App\Models\User;

class IcemanPolicy
{
    public function manageUsers(Iceman $iceman): bool
    {
        return true;
    }
}
