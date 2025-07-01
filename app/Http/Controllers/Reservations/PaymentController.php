<?php

namespace App\Http\Controllers\Reservations;

use App\Http\Controllers\Controller;
use App\Models\Reservations\Reservation;
use Illuminate\Database\Eloquent\ModelNotFoundException;

use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function getSnapToken(string $id)
    {
        try {
            $reservation = Reservation::with('reservationGuest.user')->findOrFail($id);

            Config::$serverKey = env('MIDTRANS_SERVER_KEY');
            Config::$isProduction = env('APP_ENV') === 'production';
            Config::$isSanitized = true;
            Config::$is3ds = true;

            $params = [
                'transaction_details' => [
                    'order_id' => $reservation->id,
                    'gross_amount' => $reservation->total_price,
                ],
                'customer_details' => [
                    'email' => $reservation->reservationGuest->user->email,
                ],
                'callbacks' => [
                    'finish' => route('home'),
                ],
            ];

            // get midtrans snap token
            $snapToken = Snap::getSnapToken($params);

            // update reservation snap token
            $reservation->update([
                'snap_token' => $snapToken,
            ]);

            return redirect()->route('home');
        } catch (ModelNotFoundException $e) {
            return back()->withErrors([
                'message' => 'Reservation not found',
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'message' => 'Failed to get snap token',
                'error' => $e->getMessage(),
            ]);
        }
    }
}
