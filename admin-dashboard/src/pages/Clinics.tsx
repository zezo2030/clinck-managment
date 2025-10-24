import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Plus, ToggleLeft, ToggleRight, Pencil, Trash2 } from 'lucide-react';
import { clinicsService } from '@/services';
import { useApi, useApiMutation } from '@/hooks/useApi';

const Clinics: React.FC = () => {
  const { data, isLoading, refetch } = useApi<any[]>(['clinics'], () => clinicsService.getClinics().then((d:any)=> Array.isArray(d)? d : (d?.items||[])));

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<null | number>(null);

  const createMutation = useApiMutation((payload: any) => clinicsService.createClinic(payload), {
    onSuccess: () => { setOpenCreate(false); refetch(); },
  });
  const updateMutation = useApiMutation(({ id, payload }: { id: number; payload: any }) => clinicsService.updateClinic(id, payload), {
    onSuccess: () => { setOpenEdit(null); refetch(); },
  });
  const deleteMutation = useApiMutation((id: number) => clinicsService.deleteClinic(id), {
    onSuccess: () => refetch(),
  });
  const toggleActiveMutation = useApiMutation(({ id, isActive }: { id: number; isActive: boolean }) => clinicsService.setActive(id, isActive), {
    onSuccess: () => refetch(),
  });

  const clinics = React.useMemo(() => (data || []) as any[], [data]);
  const filtered = React.useMemo(() => {
    if (!search) return clinics;
    const q = search.toLowerCase();
    return clinics.filter((c) => [c.name, c.address, c.phone, c.email].filter(Boolean).some((v:string)=> String(v).toLowerCase().includes(q)));
  }, [clinics, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'name', title: 'الاسم', sortable: true },
    { key: 'address', title: 'العنوان' },
    { key: 'phone', title: 'الهاتف' },
    { key: 'email', title: 'البريد' },
    {
      key: 'isActive',
      title: 'الحالة',
      render: (val: boolean, row: any) => (
        <Button variant="outline" size="sm" onClick={() => toggleActiveMutation.mutate({ id: row.id, isActive: !val })}>
          {val ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
          {val ? 'مفعّل' : 'معطّل'}
        </Button>
      ),
    },
    {
      key: 'id',
      title: 'إجراءات',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setOpenEdit(row.id)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(row.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ] as any;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="إدارة العيادات" description="عرض وإدارة جميع العيادات في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة عيادة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة عيادة</DialogTitle>
              </DialogHeader>
              <ClinicForm onSubmit={(values) => createMutation.mutate(values)} submitting={createMutation.isLoading} />
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

        {openEdit !== null && (
          <Dialog open onOpenChange={(o) => !o && setOpenEdit(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تعديل عيادة</DialogTitle>
              </DialogHeader>
              <ClinicForm
                initialValues={clinics.find((c) => c.id === openEdit)}
                onSubmit={(values) => updateMutation.mutate({ id: openEdit!, payload: values })}
                submitting={updateMutation.isLoading}
                isEdit
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenEdit(null)}>إلغاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </AdminLayout>
  );
};

const ClinicForm: React.FC<{
  initialValues?: Partial<any>;
  onSubmit: (values: Partial<any>) => void;
  submitting?: boolean;
  isEdit?: boolean;
}> = ({ initialValues, onSubmit, submitting, isEdit }) => {
  const [form, setForm] = React.useState<Partial<any>>({
    name: '', address: '', phone: '', email: '', description: '', ...initialValues,
  });

  const handle = (k: keyof any) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); onSubmit(form); };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" value={form.name as any} onChange={handle('name')} required />
        </div>
        <div>
          <Label htmlFor="phone">الهاتف</Label>
          <Input id="phone" value={form.phone as any} onChange={handle('phone')} />
        </div>
        <div>
          <Label htmlFor="email">البريد</Label>
          <Input id="email" value={form.email as any} onChange={handle('email')} />
        </div>
        <div>
          <Label htmlFor="address">العنوان</Label>
          <Input id="address" value={form.address as any} onChange={handle('address')} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">الوصف</Label>
          <Input id="description" value={form.description as any} onChange={handle('description')} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
      </div>
    </form>
  );
};

export default Clinics;

