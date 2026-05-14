<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class StaffManagementController extends Controller
{
    public function index(): Response
    {
        $staffMembers = User::where('role', 'staff')
            ->withCount('transactions')
            ->orderBy('name')
            ->get()
            ->map(fn ($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'transactionCount' => $u->transactions_count,
                'createdAt' => $u->created_at->format('d M Y'),
                'lastActivity' => $u->transactions()
                    ->latest()
                    ->first()?->created_at?->diffForHumans() ?? 'Belum ada',
            ]);

        return Inertia::render('staff-management', [
            'staffMembers' => $staffMembers,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Akun staff berhasil dibuat.',
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        if ($user->role !== 'staff') {
            abort(403, 'Cannot modify non-staff accounts.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update($validated);

        // Optional password update
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['string', 'min:8', 'confirmed'],
            ]);
            $user->update(['password' => Hash::make($request->input('password'))]);
        }

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Akun staff berhasil diperbarui.',
        ]);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->role !== 'staff') {
            abort(403, 'Cannot delete non-staff accounts.');
        }

        $user->delete();

        return back()->with('flash', [
            'type' => 'success',
            'message' => 'Akun staff berhasil dihapus.',
        ]);
    }
}
