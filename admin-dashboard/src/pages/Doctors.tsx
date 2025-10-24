import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Stethoscope, Plus, Pencil, Trash2, ToggleRight, ToggleLeft } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { doctorsService, clinicsService, specialtiesService } from '@/services';

const Doctors: React.FC = () => {
  const { data, isLoading, refetch } = useApi<any[]>(['doctors'], () => doctorsService.getDoctors().then((d:any)=> Array.isArray(d)? d : (d?.items||[])));

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<null | number>(null);

  const createMutation = useApiMutation((payload: any) => doctorsService.createDoctor(payload), {
    onSuccess: () => { setOpenCreate(false); refetch(); },
  });
  const updateMutation = useApiMutation(({ id, payload }: { id: number; payload: any }) => doctorsService.updateDoctor(id, payload), {
    onSuccess: () => { setOpenEdit(null); refetch(); },
  });
  const deleteMutation = useApiMutation((id: number) => doctorsService.deleteDoctor(id), {
    onSuccess: () => refetch(),
  });
  const toggleAvailability = useApiMutation(({ id, isAvailable }: { id: number; isAvailable: boolean }) => doctorsService.setAvailability(id, isAvailable), {
    onSuccess: () => refetch(),
  });

  const doctors = React.useMemo(() => (data || []) as any[], [data]);
  const filtered = React.useMemo(() => {
    if (!search) return doctors;
    const q = search.toLowerCase();
    return doctors.filter((d) => [d.email, d.licenseNumber, d.firstName, d.lastName, d.name].filter(Boolean).some((v:string)=> String(v).toLowerCase().includes(q)));
  }, [doctors, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'email', title: 'البريد', sortable: true },
    {
      key: 'name',
      title: 'الاسم',
      render: (_: any, row: any) => row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    { key: 'licenseNumber', title: 'رقم الترخيص' },
    {
      key: 'isAvailable',
      title: 'متاح',
      render: (val: boolean, row: any) => (
        <Button variant="outline" size="sm" onClick={() => toggleAvailability.mutate({ id: row.id, isAvailable: !val })}>
          {val ? <ToggleRight className="h-4 w-4 mr-1" /> : <ToggleLeft className="h-4 w-4 mr-1" />}
          {val ? 'متاح' : 'غير متاح'}
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
        <PageHeader title="إدارة الأطباء" description="عرض وإدارة جميع الأطباء في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة طبيب
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة طبيب</DialogTitle>
              </DialogHeader>
              <DoctorForm onSubmit={(values) => createMutation.mutate(values)} submitting={createMutation.isLoading} />
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
                <DialogTitle>تعديل طبيب</DialogTitle>
              </DialogHeader>
              <DoctorForm
                initialValues={doctors.find((d) => d.id === openEdit)}
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

const DoctorForm: React.FC<{
  initialValues?: Partial<any>;
  onSubmit: (values: Partial<any>) => void;
  submitting?: boolean;
  isEdit?: boolean;
}> = ({ initialValues, onSubmit, submitting, isEdit }) => {
  const [form, setForm] = React.useState<Partial<any>>({
    email: '',
    password: '' as any,
    firstName: '',
    lastName: '',
    phone: '',
    licenseNumber: '',
    specialties: '' as any, // comma-separated IDs
    clinics: '' as any, // comma-separated IDs
    ...initialValues,
  });

  const [specialties, setSpecialties] = React.useState<any[]>([]);
  const [clinics, setClinics] = React.useState<any[]>([]);

  React.useEffect(() => {
    specialtiesService.getSpecialties().then((d:any)=> setSpecialties(Array.isArray(d)? d : (d?.items||[])));
    clinicsService.getClinics().then((d:any)=> setClinics(Array.isArray(d)? d : (d?.items||[])));
  }, []);

  const handle = (k: keyof any) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p) => ({ ...p, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = { ...form };
    if (typeof payload.specialties === 'string') payload.specialties = payload.specialties.split(',').map((n: string)=> parseInt(n.trim())).filter(Boolean);
    if (typeof payload.clinics === 'string') payload.clinics = payload.clinics.split(',').map((n: string)=> parseInt(n.trim())).filter(Boolean);
    if (isEdit) delete payload.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">البريد</Label>
          <Input id="email" value={form.email as any} onChange={handle('email')} required disabled={!!isEdit} />
        </div>
        {!isEdit && (
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" value={(form as any).password || ''} onChange={handle('password')} required />
          </div>
        )}
        <div>
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" value={form.firstName as any} onChange={handle('firstName')} required />
        </div>
        <div>
          <Label htmlFor="lastName">الاسم الأخير</Label>
          <Input id="lastName" value={form.lastName as any} onChange={handle('lastName')} required />
        </div>
        <div>
          <Label htmlFor="phone">الهاتف</Label>
          <Input id="phone" value={form.phone as any} onChange={handle('phone')} />
        </div>
        <div>
          <Label htmlFor="licenseNumber">رقم الترخيص</Label>
          <Input id="licenseNumber" value={form.licenseNumber as any} onChange={handle('licenseNumber')} required />
        </div>
        <div className="col-span-2">
          <Label htmlFor="specialties">التخصصات (IDs مفصولة بفواصل)</Label>
          <Input id="specialties" value={(form as any).specialties || ''} onChange={handle('specialties')} placeholder={specialties.map((s)=> s.id).slice(0,5).join(', ')} />
        </div>
        <div className="col-span-2">
          <Label htmlFor="clinics">العيادات (IDs مفصولة بفواصل)</Label>
          <Input id="clinics" value={(form as any).clinics || ''} onChange={handle('clinics')} placeholder={clinics.map((c)=> c.id).slice(0,5).join(', ')} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
      </div>
    </form>
  );
};

export default Doctors;

