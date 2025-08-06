<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ContactHistoryController extends Controller
{
    /**
     * Display a listing of contact histories with search and filtering
     */
    public function index(Request $request): JsonResponse
    {
        $query = ContactHistory::with('contact');

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('contact', function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            })->orWhere('action', 'ilike', "%{$search}%")
              ->orWhere('field', 'ilike', "%{$search}%");
        }

        // Filter by action
        if ($request->has('action') && !empty($request->action)) {
            $query->where('action', $request->action);
        }

        // Filter by contact
        if ($request->has('contact_id') && !empty($request->contact_id)) {
            $query->where('contact_id', $request->contact_id);
        }

        // Filter by user
        if ($request->has('user_id') && !empty($request->user_id)) {
            $query->where('user_id', $request->user_id);
        }

        // Date range filter
        if ($request->has('date_from') && !empty($request->date_from)) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && !empty($request->date_to)) {
            $query->where('created_at', '<=', $request->date_to);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $histories = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $histories->items(),
            'pagination' => [
                'current_page' => $histories->currentPage(),
                'last_page' => $histories->lastPage(),
                'per_page' => $histories->perPage(),
                'total' => $histories->total(),
            ],
        ]);
    }

    /**
     * Display the specified contact history entry
     */
    public function show(ContactHistory $contactHistory): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $contactHistory->load('contact'),
        ]);
    }

    /**
     * Get history for a specific contact
     */
    public function contactHistory(Contact $contact): JsonResponse
    {
        $histories = $contact->histories()
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'contact' => $contact,
                'histories' => $histories,
            ],
        ]);
    }

    /**
     * Get available actions for filtering
     */
    public function actions(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ContactHistory::getActions(),
        ]);
    }

    /**
     * Get history statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_entries' => ContactHistory::count(),
            'created_actions' => ContactHistory::where('action', ContactHistory::ACTION_CREATED)->count(),
            'updated_actions' => ContactHistory::where('action', ContactHistory::ACTION_UPDATED)->count(),
            'deleted_actions' => ContactHistory::where('action', ContactHistory::ACTION_DELETED)->count(),
            'recent_activity' => ContactHistory::where('created_at', '>=', now()->subDays(7))->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
