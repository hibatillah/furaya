import ThemeToggle from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "@/components/ui/sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  bookingTypeBadgeColor,
  reservationStatusBadgeColor,
  roomPackageBadgeColor,
  statusAccBadgeColor,
  transactionStatusBadgeColor,
  visitPurposeBadgeColor,
} from "@/static/reservation";
import { roomConditionBadgeColor, roomStatusBadgeColor, smokingTypeBadgeColor } from "@/static/room";
import { roleBadgeColor } from "@/static/user";
import { Head } from "@inertiajs/react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";

export default function DesignSystem() {
  return (
    <div className="container mx-auto flex flex-col gap-4 px-4 py-10 lg:px-12">
      <Head title="Design System" />

      <div className="relative mb-4">
        <h1 className="text-2xl font-bold tracking-tighter">Design System</h1>
        <p className="text-muted-foreground">Design system used in this hotel management system.</p>
        <ThemeToggle className="absolute top-0 right-0" />
      </div>

      {/* buttons */}
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Buttons</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-x-4 gap-y-3">
          <Button variant="default">Default Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="secondary"
                size="icon"
              >
                <PlusIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Icon Button</TooltipContent>
          </Tooltip>
          <Button
            variant="secondary"
            size="sm"
          >
            Small Button
          </Button>
        </CardContent>
      </Card>

      {/* toasts */}
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Toasts</CardTitle>
          <CardDescription>Click button to see toast variants.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Success", {
                description: "Some success info",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.info("Info", {
                description: "Some detail info ",
              })
            }
          >
            Info
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.warning("Warning", {
                description: "Some warning info",
              })
            }
          >
            Warning
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.error("Error", {
                description: "Some error info",
              })
            }
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              toast.loading("Loading...", { id: "loading" });

              setTimeout(() => {
                toast.dismiss();
              }, 2000);
            }}
          >
            Loading
          </Button>
        </CardContent>
      </Card>

      {/* badges */}
      <Card className="gap-4">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Badges</CardTitle>
        </CardHeader>
        <CardContent
          className={cn(
            "*:data-[name=badges]:flex *:data-[name=badges]:flex-wrap *:data-[name=badges]:gap-x-2 *:data-[name=badges]:gap-y-3 *:data-[name=badges]:not-last:mb-4",
            "*:[h3]:text-card-foreground/80 *:[h3]:ms-0.5 *:[h3]:mb-1 *:[h3]:text-sm",
            {
              "*:opacity-10 *:data-[name=badges]:nth-of-type-7:opacity-100": false, // manually highlight some row
            },
          )}
        >
          <h3>Reservation Status</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor.pending}
            >
              pending
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor.booked}
            >
              booked
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor["checked in"]}
            >
              checked in
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor["checked out"]}
            >
              checked out
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor["no show"]}
            >
              no show
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor.cancelled}
            >
              cancelled
            </Badge>
            <Badge
              variant="outline"
              className={reservationStatusBadgeColor.overdue}
            >
              overdue
            </Badge>
          </div>

          <h3>Booking Type</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={bookingTypeBadgeColor.direct}
            >
              direct
            </Badge>
            <Badge
              variant="outline"
              className={bookingTypeBadgeColor.online}
            >
              online
            </Badge>
            <Badge
              variant="outline"
              className={bookingTypeBadgeColor["walk in"]}
            >
              walk in
            </Badge>
            <Badge
              variant="outline"
              className={bookingTypeBadgeColor.travel}
            >
              travel
            </Badge>
            <Badge
              variant="outline"
              className={bookingTypeBadgeColor.other}
            >
              other
            </Badge>
          </div>

          <h3>Visit Purpose</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.vacation}
            >
              vacation
            </Badge>
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.business}
            >
              business
            </Badge>
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.study}
            >
              study
            </Badge>
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.family}
            >
              family
            </Badge>
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.seminar}
            >
              seminar
            </Badge>
            <Badge
              variant="outline"
              className={visitPurposeBadgeColor.other}
            >
              other
            </Badge>
          </div>

          <h3>Room Packages</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={roomPackageBadgeColor["bed and breakfast"]}
            >
              bed and breakfast
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor["half board"]}
            >
              half board
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor["full board"]}
            >
              full board
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor.honeymoon}
            >
              honeymoon
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor.family}
            >
              family
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor["romantic gateway"]}
            >
              romantic gateway
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor["business package"]}
            >
              business package
            </Badge>
            <Badge
              variant="outline"
              className={roomPackageBadgeColor.other}
            >
              other
            </Badge>
          </div>

          <h3>Status Acc Reservation</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={statusAccBadgeColor.approved}
            >
              approved
            </Badge>
            <Badge
              variant="outline"
              className={statusAccBadgeColor.pending}
            >
              pending
            </Badge>
            <Badge
              variant="outline"
              className={statusAccBadgeColor.rejected}
            >
              rejected
            </Badge>
          </div>

          <h3>Transaction Status</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={transactionStatusBadgeColor.settlement}
            >
              settlement
            </Badge>
            <Badge
              variant="outline"
              className={transactionStatusBadgeColor.unpaid}
            >
              unpaid
            </Badge>
          </div>

          <h3>Room Condition</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.ready}
            >
              ready
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.booked}
            >
              booked
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.cleaning}
            >
              cleaning
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.maintenance}
            >
              maintenance
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor["booked cleaning"]}
            >
              booked cleaning
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.unclean}
            >
              unclean
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.blocked}
            >
              blocked
            </Badge>
            <Badge
              variant="outline"
              className={roomConditionBadgeColor.unreserved}
            >
              unreserved
            </Badge>
          </div>

          <h3>Room Status</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={roomStatusBadgeColor.Occupied}
            >
              occupied
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor.Vacant}
            >
              vacant
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["House Use"]}
            >
              house use
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Out of Order"]}
            >
              out of order
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Check Out"]}
            >
              check out
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Check In"]}
            >
              check in
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Check In Pagi"]}
            >
              check in pagi
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Part Day Use"]}
            >
              part day use
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Day Use"]}
            >
              day use
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["OCC No Luggage"]}
            >
              occ no luggage
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Sleep Out"]}
            >
              sleep out
            </Badge>
            <Badge
              variant="outline"
              className={roomStatusBadgeColor["Do Not Disturb"]}
            >
              do not disturb
            </Badge>
          </div>

          <h3>Smoking Type</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={smokingTypeBadgeColor.smoking}
            >
              smoking
            </Badge>
            <Badge
              variant="outline"
              className={smokingTypeBadgeColor["non smoking"]}
            >
              non smoking
            </Badge>
          </div>

          <h3>User Role</h3>
          <div data-name="badges">
            <Badge
              variant="outline"
              className={roleBadgeColor.manager}
            >
              manager
            </Badge>
            <Badge
              variant="outline"
              className={roleBadgeColor.admin}
            >
              admin
            </Badge>
            <Badge
              variant="outline"
              className={roleBadgeColor.employee}
            >
              employee
            </Badge>
            <Badge
              variant="outline"
              className={roleBadgeColor.guest}
            >
              guest
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Toaster />
    </div>
  );
}
