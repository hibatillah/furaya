import { DataList } from "@/components/data-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

export default function EmployeeShow(props: { data: Employee.Default; onClose: () => void }) {
  const { data, onClose } = props;

  const dataList = [
    {
      label: "Nama",
      value: data.user?.name,
    },
    {
      label: "Email",
      value: data.user?.email,
    },
    {
      label: "No. HP",
      value: data.phone,
    },
    {
      label: "Gender",
      value: (
        <Badge
          variant="secondary"
          className="border-secondary-foreground/20 dark:border-secondary-foreground/10 rounded-full font-medium"
        >
          {data.formatted_gender}
        </Badge>
      ),
    },
    {
      label: "Departemen",
      value: (
        <Badge
          variant="secondary"
          className="border-secondary-foreground/20 dark:border-secondary-foreground/10 rounded-full font-medium"
        >
          {data.department?.name}
        </Badge>
      ),
    },
    {
      label: "Tanggal Bergabung",
      value: data.formatted_hire_date,
    },
    {
      label: "Gaji",
      value: data.salary ? formatCurrency(data.salary) : "-",
    },
    {
      label: "Alamat",
      value: data.address,
    },
  ];

  return (
    <>
      <DialogHeader>
        <DialogTitle>Detail Karyawan</DialogTitle>
      </DialogHeader>
      <Separator />
      <DataList data={dataList} />
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onClose}
        >
          Kembali
        </Button>
      </div>
    </>
  );
}
