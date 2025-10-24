import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Bell, Plus, ArrowUpRight, Trash2 } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { waitingListService, doctorsService } from '@/services';

const WaitingList: React.FC = () => {
  const [doctorId, setDoctorId] = React.useState<number | undefined>(undefined);
  const { data, isLoading, refetch } = useApi<any[]>(['waiting-list', String(doctorId||'')], () => waitingListService.get(doctorId).then((d:any)=> Array.isArray(d)? d : (d?.items||d||[])));

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openAdd, setOpenAdd] = React.useState(false);

  const addMutation = useApiMutation((payload: any) => waitingListService.add(payload), { onSuccess: () => { setOpenAdd(false); refetch(); } });
  const removeMutation = useApiMutation((id: number) => waitingListService.remove(id), { onSuccess: refetch });
  const priorityMutation = useApiMutation(({ id, priority }: { id: number; priority: number }) => waitingListService.updatePriority(id, priority), { onSuccess: refetch });
  const notifyMutation = useApiMutation(({ doctorId, date, time }: { doctorId: number; date: string; time: string }) => waitingListService.notifyNext(doctorId, date, time), {});

  const items = React.useMemo(() => (data || []) as any[], [data]);
  const filtered = React.useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((w) => [w?.patient?.firstName, w?.doctor?.firstName, String(w.priority)].filter(Boolean).some((v:string)=> String(v).toLowerCase().includes(q)));
  }, [items, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'id', title: '#', width: '60px' },
    { key: 'patient', title: 'المريض', render: (_: any, row: any) => row?.patient?.firstName || row.patientId },
    { key: 'doctor', title: 'الطبيب', render: (_: any, row: any) => row?.doctor?.firstName || row.doctorId },
    { key: 'priority', title: 'الأولوية', render: (val: number, row: any) => (
      <div className="flex items-center gap-2">
        <Input className="w-20 h-8" type="number" min={1} max={10} defaultValue={val} onBlur={(e)=> priorityMutation.mutate({ id: row.id, priority: parseInt(e.target.value || '1') })} />
      </div>
    ) },
    {
      key: 'actions',
      title: 'إجراءات',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="destructive" size="sm" onClick={() => removeMutation.mutate(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ] as any;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="قوائم الانتظار" description="عرض وإدارة قوائم الانتظار للمرضى" />

        <div className="flex items-center gap-2">
          <Input className="w-48" placeholder="ID الطبيب (اختياري)" value={doctorId as any || ''} onChange={(e)=> setDoctorId(e.target.value ? parseInt(e.target.value) : undefined)} />
          <Input className="flex-1" placeholder="بحث..." value={search} onChange={(e)=> setSearch(e.target.value)} />
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة إلى القائمة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مريض إلى القائمة</DialogTitle>
              </DialogHeader>
              <AddWaitingForm onSuccess={() => { setOpenAdd(false); refetch(); }} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenAdd(false)}>إلغاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <NotifyNext onNotify={(payload)=> notifyMutation.mutate(payload as any)} />
        </div>

        <DataTable
          data={pageData}
          columns={columns}
          loading={isLoading}
          searchable={false}
          pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: (l)=>{ setLimit(l); setPage(1); } }}
        />
      </div>
    </AdminLayout>
  );
};

const AddWaitingForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = React.useState<{ patientId?: number; doctorId?: number; departmentId?: number; priority?: number }>({ priority: 1 });
  const [doctors, setDoctors] = React.useState<any[]>([]);

  React.useEffect(() => {
    doctorsService.getDoctors().then((d:any)=> setDoctors(Array.isArray(d)? d : (d?.items||[])));
  }, []);

  const addMutation = useApiMutation(() => waitingListService.add(form as any), { onSuccess });
  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p)=> ({ ...p, [k]: e.target.value as any }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); addMutation.mutate(); };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="doctorId">ID الطبيب</Label>
          <Input id="doctorId" value={form.doctorId as any || ''} onChange={handle('doctorId')} placeholder={`مثال: ${doctors.map((d)=> d.id).slice(0,5).join(', ')}`} required />
        </div>
        <div>
          <Label htmlFor="patientId">ID المريض</Label>
          <Input id="patientId" value={form.patientId as any || ''} onChange={handle('patientId')} required />
        </div>
        <div>
          <Label htmlFor="departmentId">ID القسم (اختياري)</Label>
          <Input id="departmentId" value={form.departmentId as any || ''} onChange={handle('departmentId')} />
        </div>
        <div>
          <Label htmlFor="priority">الأولوية</Label>
          <Input id="priority" type="number" min={1} max={10} value={form.priority as any || 1} onChange={handle('priority')} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={addMutation.isLoading}>{addMutation.isLoading ? 'جارٍ الإضافة...' : 'إضافة'}</Button>
      </div>
    </form>
  );
};

const NotifyNext: React.FC<{ onNotify: (payload: { doctorId: number; date: string; time: string }) => void }> = ({ onNotify }) => {
  const [form, setForm] = React.useState<{ doctorId?: number; date: string; time: string }>({ date: '', time: '' });
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (form.doctorId && form.date && form.time) onNotify(form as any); };
  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p)=> ({ ...p, [k]: e.target.value as any }));
  return (
    <form onSubmit={submit} className="flex items-end gap-2">
      <div>
        <Label htmlFor="doctor">ID الطبيب</Label>
        <Input id="doctor" className="w-28" value={form.doctorId as any || ''} onChange={handle('doctorId')} />
      </div>
      <div>
        <Label htmlFor="date">التاريخ</Label>
        <Input id="date" type="date" className="w-40" value={form.date} onChange={handle('date')} />
      </div>
      <div>
        <Label htmlFor="time">الوقت</Label>
        <Input id="time" type="time" className="w-32" value={form.time} onChange={handle('time')} />
      </div>
      <Button type="submit" className="mt-6"><ArrowUpRight className="h-4 w-4 mr-1" /> إشعار التالي</Button>
    </form>
  );
};

export default WaitingList;

