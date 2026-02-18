<?php

namespace App\Http\Controllers\API;

use App\Models\Person;
use App\Models\Face;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class PersonController extends Controller
{
    /**
     * قائمة الأشخاص المعروفين
     */
    public function index(): JsonResponse
    {
        $persons = Person::with('faces')->get();
        return response()->json([
            'success' => true,
            'data' => $persons
        ]);
    }

    /**
     * إضافة شخص جديد
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_trusted' => 'boolean',
            'notes' => 'nullable|string'
        ]);

        $person = Person::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم إضافة الشخص بنجاح',
            'data' => $person
        ], 201);
    }

    /**
     * تفاصيل الشخص
     */
    public function show(int $id): JsonResponse
    {
        $person = Person::with('faces', 'detections')->findOrFail($id);
        return response()->json([
            'success' => true,
            'data' => $person
        ]);
    }

    /**
     * تحديث بيانات الشخص
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $person = Person::findOrFail($id);

        $validated = $request->validate([
            'name' => 'string|max:255',
            'email' => 'nullable|email',
            'phone' => 'nullable|string',
            'is_trusted' => 'boolean',
            'notes' => 'nullable|string'
        ]);

        $person->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'تم تحديث بيانات الشخص بنجاح',
            'data' => $person
        ]);
    }

    /**
     * حذف الشخص
     */
    public function destroy(int $id): JsonResponse
    {
        $person = Person::findOrFail($id);
        $person->faces()->delete();
        $person->delete();

        return response()->json([
            'success' => true,
            'message' => 'تم حذف الشخص بنجاح'
        ]);
    }

    /**
     * إضافة صورة وجه للشخص
     */
    public function addFace(Request $request, int $id): JsonResponse
    {
        $person = Person::findOrFail($id);

        $validated = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5120'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('faces/' . $person->id, 'public');
            
            $face = Face::create([
                'person_id' => $person->id,
                'image_path' => $path,
                'verified' => false
            ]);

            return response()->json([
                'success' => true,
                'message' => 'تم إضافة صورة الوجه بنجاح',
                'data' => $face
            ], 201);
        }

        return response()->json([
            'success' => false,
            'message' => 'فشل في رفع الصورة'
        ], 400);
    }
}
