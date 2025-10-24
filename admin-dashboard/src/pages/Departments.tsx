import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Building2, Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { departmentsService, clinicsService } from '@/services';
import { Department } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Departments: React.FC = () => {
  const [clinicFilter, setClinicFilter] = React.useState<number | undefined>(undefined);
  const { data, isLoading, refetch } = useApi<any[]>(['departments', String(clinicFilter || '')], () => 
    departmentsService.getDepartments(clinicFilter).then((d: any) => Array.isArray(d) ? d : (d?.items || []))
  );

  const { data: clinicsData } = useApi<any[]>(['clinics'], () => 
    clinicsService.getClinics().then((d: any) => Array.isArray(d) ? d : (d?.items || []))
  );

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<null | number>(null);

  const createMutation = useApiMutation((payload: Partial<Department>) => 
    departmentsService.createDepartment(payload), {
    onSuccess: () => { setOpenCreate(false); refetch(); },
  });

  const updateMutation = useApiMutation(({ id, payload }: { id: number; payload: Partial<Department> }) => 
    departmentsService.updateDepartment(id, payload), {
    onSuccess: () => { setOpenEdit(null); refetch(); },
  });

  const deleteMutation = useApiMutation((id: number) => 
    departmentsService.deleteDepartment(id), {
    onSuccess: () => refetch(),
  });

  const toggleActiveMutation = useApiMutation(({ id, isActive }: { id: number; isActive: boolean }) => 
    departmentsService.setActive(id, isActive), {
    onSuccess: () => refetch(),
  });

  const departments = React.useMemo(() => (data || []) as Department[], [data]);
  const clinics = React.useMemo(() => (clinicsData || []) as any[], [clinicsData]);
  
  const filtered = React.useMemo(() => {
    if (!search) return departments;
    const q = search.toLowerCase();
    return departments.filter((d) => 
      [d.name, d.description, d?.clinic?.name].filter(Boolean).some((v: string) => 
        String(v).toLowerCase().includes(q)
      )
    );
  }, [departments, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'name', title: 'الاسم', sortable: true },
    { key: 'description', title: 'الوصف', render: (val: string) => val ? (val.length > 50 ? val.substring(0, 50) + '...' : val) : '-' },
    { 
      key: 'clinic', 
      title: 'العيادة', 
      render: (val: any, row: any) => row?.clinic?.name || `ID: ${row.clinicId}` 
    },
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
        <PageHeader title="إدارة الأقسام" description="عرض وإدارة جميع الأقسام في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة قسم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة قسم جديد</DialogTitle>
              </DialogHeader>
              <DepartmentForm 
                clinics={clinics}
                onSubmit={(values) => createMutation.mutate(values)} 
                submitting={createMutation.isLoading} 
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreate(false)}>إلغاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Label htmlFor="clinic-filter">فلتر العيادة</Label>
            <Select value={clinicFilter?.toString() || 'all'} onValueChange={(value) => setClinicFilter(value === 'all' ? undefined : parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="جميع العيادات" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع العيادات</SelectItem>
                {clinics.map((clinic) => (
                  <SelectItem key={clinic.id} value={clinic.id.toString()}>
                    {clinic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          data={pageData}
          columns={columns}
          loading={isLoading}
          searchable
          onSearch={setSearch}
          pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: (l) => { setLimit(l); setPage(1); } }}
        />

        {/* Edit Dialog */}
        <Dialog open={!!openEdit} onOpenChange={() => setOpenEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>تعديل القسم</DialogTitle>
            </DialogHeader>
            {openEdit && (
              <DepartmentForm 
                department={departments.find(d => d.id === openEdit)}
                clinics={clinics}
                onSubmit={(values) => updateMutation.mutate({ id: openEdit, payload: values })} 
                submitting={updateMutation.isLoading} 
              />
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenEdit(null)}>إلغاء</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

const DepartmentForm: React.FC<{ 
  department?: Department; 
  clinics: any[];
  onSubmit: (values: Partial<Department>) => void; 
  submitting: boolean 
}> = ({ department, clinics, onSubmit, submitting }) => {
  const [form, setForm] = React.useState<Partial<Department>>({
    clinicId: department?.clinicId || undefined,
    name: department?.name || '',
    description: department?.description || '',
    isActive: department?.isActive ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="clinicId">العيادة *</Label>
        <Select 
          value={form.clinicId?.toString() || ''} 
          onValueChange={(value) => setForm(prev => ({ ...prev, clinicId: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر العيادة" />
          </SelectTrigger>
          <SelectContent>
            {clinics.map((clinic) => (
              <SelectItem key={clinic.id} value={clinic.id.toString()}>
                {clinic.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="name">اسم القسم *</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">الوصف</Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="isActive"
          checked={form.isActive}
          onCheckedChange={(checked) => setForm(prev => ({ ...prev, isActive: !!checked }))}
        />
        <Label htmlFor="isActive">نشط</Label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'جارٍ الحفظ...' : (department ? 'تحديث' : 'إضافة')}
        </Button>
      </div>
    </form>
  );
};

export default Departments;
