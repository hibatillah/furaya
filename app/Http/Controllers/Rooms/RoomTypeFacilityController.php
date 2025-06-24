<?php

namespace App\Http\Controllers\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Rooms\RoomTypeFacility;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class RoomTypeFacilityController extends Controller
{
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $roomTypeFacility = RoomTypeFacility::findOrFail($id);
            $roomTypeFacility->delete();

            return redirect()->back();
        } catch (ModelNotFoundException $e) {
            report($e);
            return back()->withErrors([
                'message' => 'Fasilitas Tipe Kamar tidak ditemukan',
            ]);
        } catch (\Exception $e) {
            report($e);
            return back()->withErrors([
                'message' => "Terjadi kesalahan menghapus fasilitas tipe kamar.",
            ]);
        }
    }
}
