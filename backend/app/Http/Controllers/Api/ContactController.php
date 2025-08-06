<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\ContactHistory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of contacts with search functionality
     */
    public function index(Request $request): JsonResponse
    {
        $query = Contact::query();

        // Search functionality
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'ilike', "%{$search}%")
                  ->orWhere('last_name', 'ilike', "%{$search}%")
                  ->orWhere('email', 'ilike', "%{$search}%");
            });
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $contacts = $query->orderBy('created_at', 'desc')->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $contacts->items(),
            'pagination' => [
                'current_page' => $contacts->currentPage(),
                'last_page' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'total' => $contacts->total(),
            ],
        ]);
    }

    /**
     * Store a newly created contact with 20-second delay
     */
    public function store(Request $request): JsonResponse
    {
        // Validate request
        $validator = Validator::make($request->all(), Contact::getValidationRules(), Contact::getValidationMessages());

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Simulate 20-second delay as specified
        sleep(20);

        try {
            DB::beginTransaction();

            // Create contact
            $contact = Contact::create($request->only(['first_name', 'last_name', 'email', 'phone']));

            // Log creation in history
            ContactHistory::logCreation($contact, $request->user_id ?? 'system');

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contact created successfully',
                'data' => $contact->load('histories'),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create contact',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified contact
     */
    public function show(Contact $contact): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $contact->load('histories'),
        ]);
    }

    /**
     * Update the specified contact
     */
    public function update(Request $request, Contact $contact): JsonResponse
    {
        // Validate request
        $validator = Validator::make(
            $request->all(), 
            Contact::getValidationRules($contact->id), 
            Contact::getValidationMessages()
        );

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            DB::beginTransaction();

            $oldData = $contact->toArray();
            $contact->update($request->only(['first_name', 'last_name', 'email', 'phone']));
            $newData = $contact->fresh()->toArray();

            // Log changes in history
            foreach ($request->only(['first_name', 'last_name', 'email', 'phone']) as $field => $newValue) {
                if ($oldData[$field] !== $newValue) {
                    ContactHistory::logUpdate(
                        $contact, 
                        $field, 
                        $oldData[$field], 
                        $newValue, 
                        $request->user_id ?? 'system'
                    );
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contact updated successfully',
                'data' => $contact->load('histories'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update contact',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified contact
     */
    public function destroy(Contact $contact): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Log deletion in history before deleting
            ContactHistory::logDeletion($contact, request()->user_id ?? 'system');

            $contact->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully',
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get contact statistics
     */
    public function stats(): JsonResponse
    {
        $stats = [
            'total_contacts' => Contact::count(),
            'recent_updates' => ContactHistory::where('action', ContactHistory::ACTION_UPDATED)
                ->where('created_at', '>=', now()->subDays(7))
                ->count(),
            'system_status' => 'ONLINE',
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
