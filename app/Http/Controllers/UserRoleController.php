<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserRoleController extends Controller
{
    /**
     * Get list of users with their roles
     */
    public function index()
    {
        $users = User::select(['id', 'name', 'email', 'role', 'created_at'])
            ->orderBy('id', 'asc')
            ->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:administrator,admin,operator,user',
        ]);

        $user->update([
            'role' => $validated['role'],
        ]);

        return response()->json([
            'message' => 'Role pengguna berhasil diperbarui.',
            'user'    => $user->fresh(),
        ]);
    }

    /**
     * Quick role switcher for demo/testing
     */
    public function switchRole(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|in:administrator,admin,operator,user',
        ]);

        $user = Auth::user();
        if ($user) {
            $user->update([
                'role' => $validated['role'],
            ]);

            return response()->json([
                'message' => 'Role aktif berhasil dialihkan ke ' . $validated['role'],
                'user'    => $user->fresh(),
            ]);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }
}
