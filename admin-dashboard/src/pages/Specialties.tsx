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
import { FileText, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { specialtiesService } from '@/services';
import { Specialty } from '@/types';

const Specialties: React.FC = () => {
  const { data, isLoading, refetch } = useApi<any[]>(['specialties'], () => 
    specialtiesService.getSpecialties().then((d: any) => Array.isArray(d) ? d : (d?.items || []))
  );

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<null | number>(null);

  const createMutation = useApiMutation((payload: Partial<Specialty>) => 
    specialtiesService.createSpecialty(payload), {
    onSuccess: () => { setOpenCreate(false); refetch(); },
  });

  const updateMutation = useApiMutation(({ id, payload }: { id: number; payload: Partial<Specialty> }) => 
    specialtiesService.updateSpecialty(id, payload), {
    onSuccess: () => { setOpenEdit(null); refetch(); },
  });

  const deleteMutation = useApiMutation((id: number) => 
    specialtiesService.deleteSpecialty(id), {
    onSuccess: () => refetch(),
  });

  const specialties = React.useMemo(() => (data || []) as Specialty[], [data]);
  const filtered = React.useMemo(() => {
    if (!search) return specialties;
    const q = search.toLowerCase();
    return specialties.filter((s) => 
      [s.name, s.description, ...s.services].filter(Boolean).some((v: string) => 
        String(v).toLowerCase().includes(q)
      )
    );
  }, [specialties, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'name', title: 'الاسم', sortable: true },
    { key: 'description', title: 'الوصف', render: (val: string) => val ? (val.length > 50 ? val.substring(0, 50) + '...' : val) : '-' },
    { 
      key: 'services', 
      title: 'عدد الخدمات', 
      render: (val: string[]) => val?.length || 0 
    },
    {
      key: 'isActive',
      title: 'الحالة',
      render: (val: boolean, row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${val ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {val ? 'نشط' : 'معطّل'}
        </span>
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
        <PageHeader title="إدارة التخصصات" description="عرض وإدارة جميع التخصصات الطبية">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة تخصص
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة تخصص جديد</DialogTitle>
              </DialogHeader>
              <SpecialtyForm onSubmit={(values) => createMutation.mutate(values)} submitting={createMutation.isLoading} />
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
          pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: (l) => { setLimit(l); setPage(1); } }}
        />

        {/* Edit Dialog */}
        <Dialog open={!!openEdit} onOpenChange={() => setOpenEdit(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>تعديل التخصص</DialogTitle>
            </DialogHeader>
            {openEdit && (
              <SpecialtyForm 
                specialty={specialties.find(s => s.id === openEdit)}
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

const SpecialtyForm: React.FC<{ 
  specialty?: Specialty; 
  onSubmit: (values: Partial<Specialty>) => void; 
  submitting: boolean 
}> = ({ specialty, onSubmit, submitting }) => {
  const [form, setForm] = React.useState<Partial<Specialty>>({
    name: specialty?.name || '',
    description: specialty?.description || '',
    icon: specialty?.icon || '',
    services: specialty?.services || [],
    isActive: specialty?.isActive ?? true,
  });

  const [newService, setNewService] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const addService = () => {
    if (newService.trim()) {
      setForm(prev => ({
        ...prev,
        services: [...(prev.services || []), newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    setForm(prev => ({
      ...prev,
      services: prev.services?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">اسم التخصص *</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="icon">الأيقونة</Label>
          <Input
            id="icon"
            value={form.icon}
            onChange={(e) => setForm(prev => ({ ...prev, icon: e.target.value }))}
            placeholder="URL أو اسم الأيقونة"
          />
        </div>
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

      <div>
        <Label>الخدمات</Label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newService}
              onChange={(e) => setNewService(e.target.value)}
              placeholder="أضف خدمة جديدة"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
            />
            <Button type="button" onClick={addService} variant="outline">
              إضافة
            </Button>
          </div>
          <div className="space-y-1">
            {form.services?.map((service, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span className="text-sm">{service}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeService(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
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
          {submitting ? 'جارٍ الحفظ...' : (specialty ? 'تحديث' : 'إضافة')}
        </Button>
      </div>
    </form>
  );
};

export default Specialties;

