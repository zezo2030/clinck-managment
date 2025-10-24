import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Plus, CheckCircle2, XCircle, SquareCheck } from 'lucide-react';
import { appointmentsService, doctorsService, clinicsService } from '@/services';
import { useApi, useApiMutation } from '@/hooks/useApi';

const Appointments: React.FC = () => {
  const { data, isLoading, refetch } = useApi<any[]>(['appointments'], () => appointmentsService.getAppointments().then((d:any)=> Array.isArray(d)? d : (d?.items||[])));

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);

  const confirmMutation = useApiMutation((id: number) => appointmentsService.confirm(id), { onSuccess: refetch });
  const cancelMutation = useApiMutation(({ id, reason }: { id: number; reason?: string }) => appointmentsService.cancel(id, reason), { onSuccess: refetch });
  const completeMutation = useApiMutation((id: number) => appointmentsService.complete(id), { onSuccess: refetch });

  const appts = React.useMemo(() => (data || []) as any[], [data]);
  const filtered = React.useMemo(() => {
    if (!search) return appts;
    const q = search.toLowerCase();
    return appts.filter((a) => [a.status, a.date, a.time, a?.doctor?.firstName, a?.patient?.firstName].filter(Boolean).some((v:string)=> String(v).toLowerCase().includes(q)));
  }, [appts, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'date', title: 'التاريخ', sortable: true },
    { key: 'time', title: 'الوقت' },
    { key: 'status', title: 'الحالة' },
    { key: 'doctor', title: 'الطبيب', render: (_: any, row: any) => row?.doctor?.firstName || row?.doctorId },
    { key: 'patient', title: 'المريض', render: (_: any, row: any) => row?.patient?.firstName || row?.patientId },
    {
      key: 'id',
      title: 'إجراءات',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => confirmMutation.mutate(row.id)}>
            <SquareCheck className="h-4 w-4 mr-1" /> تأكيد
          </Button>
          <Button size="sm" variant="destructive" onClick={() => cancelMutation.mutate({ id: row.id })}>
            <XCircle className="h-4 w-4 mr-1" /> إلغاء
          </Button>
          <Button size="sm" variant="secondary" onClick={() => completeMutation.mutate(row.id)}>
            <CheckCircle2 className="h-4 w-4 mr-1" /> إكمال
          </Button>
        </div>
      ),
    },
  ] as any;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="إدارة المواعيد" description="عرض وإدارة جميع المواعيد في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة موعد
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة موعد</DialogTitle>
              </DialogHeader>
              <CreateAppointmentForm onSuccess={() => { setOpenCreate(false); refetch(); }} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreate(false)}>إلغاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        <DataTable
          data={pageData}
          columns={columns}
          loading={isLoading}
          searchable
          onSearch={setSearch}
          pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: (l)=>{ setLimit(l); setPage(1); } }}
        />
      </div>
    </AdminLayout>
  );
};

const CreateAppointmentForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = React.useState<{ doctorId?: number; clinicId?: number; patientId?: number; date: string; time: string; notes?: string }>({ date: '', time: '' });
  const [slots, setSlots] = React.useState<string[]>([]);
  const [doctors, setDoctors] = React.useState<any[]>([]);
  const [clinics, setClinics] = React.useState<any[]>([]);

  React.useEffect(() => {
    doctorsService.getDoctors().then((d:any)=> setDoctors(Array.isArray(d)? d : (d?.items||[])));
    clinicsService.getClinics().then((d:any)=> setClinics(Array.isArray(d)? d : (d?.items||[])));
  }, []);

  React.useEffect(() => {
    if (form.doctorId && form.date) {
      appointmentsService.getAvailableSlots(form.doctorId, form.date).then((arr:any)=> setSlots(arr || []));
    } else {
      setSlots([]);
    }
  }, [form.doctorId, form.date]);

  const createMutation = useApiMutation(() => appointmentsService.createAppointment(form as any), {
    onSuccess: onSuccess,
  });

  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p)=> ({ ...p, [k]: e.target.value as any }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); createMutation.mutate(); };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="doctor">ID الطبيب</Label>
          <Input id="doctor" value={form.doctorId as any || ''} onChange={handle('doctorId')} placeholder={`مثال: ${doctors.map((d)=> d.id).slice(0,5).join(', ')}`} required />
        </div>
        <div>
          <Label htmlFor="clinic">ID العيادة</Label>
          <Input id="clinic" value={form.clinicId as any || ''} onChange={handle('clinicId')} placeholder={`مثال: ${clinics.map((c)=> c.id).slice(0,5).join(', ')}`} required />
        </div>
        <div>
          <Label htmlFor="patient">ID المريض</Label>
          <Input id="patient" value={form.patientId as any || ''} onChange={handle('patientId')} required />
        </div>
        <div>
          <Label htmlFor="date">التاريخ</Label>
          <Input id="date" type="date" value={form.date} onChange={handle('date')} required />
        </div>
        <div>
          <Label htmlFor="time">الوقت</Label>
          <Input id="time" value={form.time} onChange={handle('time')} placeholder={slots[0] || 'HH:mm'} required />
        </div>
        <div className="col-span-2">
          <Label htmlFor="notes">ملاحظات</Label>
          <Input id="notes" value={form.notes as any || ''} onChange={handle('notes')} />
        </div>
      </div>
      {slots.length > 0 && (
        <div className="text-sm text-muted-foreground">فتحات متاحة: {slots.join(', ')}</div>
      )}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createMutation.isLoading}>{createMutation.isLoading ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
      </div>
    </form>
  );
};

export default Appointments;

