<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;

use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    /**
     * Get snap token for payment
     *
     * @param Request $request - request
     * @return JsonResponse
     */
    public function getSnapToken(Request $request)
    {
        try {
            $id = $request->reservation_id;
            $reservation = Reservation::with('reservationGuest.guest.user')->findOrFail($id);

            Config::$serverKey = env('MIDTRANS_SERVER_KEY');
            Config::$isProduction = env('APP_ENV') === 'production';
            Config::$isSanitized = true;
            Config::$is3ds = true;

            $params = [
                'transaction_details' => [
                    'order_id' => $reservation->id,
                    'gross_amount' => (int) round($reservation->total_price),
                ],
                'customer_details' => [
                    'email' => $reservation->reservationGuest->guest->user->email,
                ],
                'callbacks' => [
                    'finish' => route('public.reservation.history'),
                ],
            ];

            $snapToken = Snap::getSnapToken($params);

            $reservation->update([
                'snap_token' => $snapToken,
            ]);

            return response()->json([
                'snap_token' => $snapToken,
            ]);
        } catch (ModelNotFoundException $e) {
            report($e);
            return response()->json([
                'message' => 'Reservasi tidak ditemukan',
            ], 404);
        } catch (\Exception $e) {
            report($e);
            return response()->json([
                'message' => 'Gagal mendapatkan snap token',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
