import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users as UsersIcon, Plus, Pencil, Trash2 } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { useApiMutation } from '@/hooks/useApi';
import { usersService } from '@/services';
import { User } from '@/types';

const Users: React.FC = () => {
  const { data, isLoading, refetch } = useUsers();

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState<null | number>(null);

  const createMutation = useApiMutation((payload: Partial<User>) => usersService.createUser(payload), {
    onSuccess: () => {
      setOpenCreate(false);
      refetch();
    },
  });

  const updateMutation = useApiMutation(({ id, payload }: { id: number; payload: Partial<User> }) => usersService.updateUser(id, payload), {
    onSuccess: () => {
      setOpenEdit(null);
      refetch();
    },
  });

  const deleteMutation = useApiMutation((id: number) => usersService.deleteUser(id), {
    onSuccess: () => {
      refetch();
    },
  });

  const users: User[] = React.useMemo(() => {
    const raw = (data as any) || [];
    const arr = Array.isArray(raw) ? raw : (raw?.items || []);
    return arr as User[];
  }, [data]);

  const filtered = React.useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter((u) =>
      [u.email, u.name, u.firstName, u.lastName, u.role].filter(Boolean).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [users, search]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'email', title: 'البريد الإلكتروني', sortable: true },
    { key: 'role', title: 'الدور', sortable: true },
    {
      key: 'name',
      title: 'الاسم',
      render: (_: any, row: User) => row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim(),
    },
    { key: 'createdAt', title: 'تاريخ الإنشاء' },
    {
      key: 'id',
      title: 'إجراءات',
      render: (_: any, row: User) => (
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
        <PageHeader title="إدارة المستخدمين" description="عرض وإدارة جميع المستخدمين في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة مستخدم
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة مستخدم</DialogTitle>
              </DialogHeader>
              <UserForm onSubmit={(values) => createMutation.mutate(values)} submitting={createMutation.isLoading} />
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
          pagination={{
            page,
            limit,
            total,
            onPageChange: setPage,
            onLimitChange: (l) => { setLimit(l); setPage(1); },
          }}
          className="bg-background"
        />

        {/* Edit Dialog */}
        {openEdit !== null && (
          <Dialog open onOpenChange={(o) => !o && setOpenEdit(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>تعديل مستخدم</DialogTitle>
              </DialogHeader>
              <UserForm
                initialValues={users.find((u) => u.id === openEdit)}
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

const UserForm: React.FC<{
  initialValues?: Partial<User>;
  onSubmit: (values: Partial<User>) => void;
  submitting?: boolean;
  isEdit?: boolean;
}> = ({ initialValues, onSubmit, submitting, isEdit }) => {
  const [form, setForm] = React.useState<Partial<User>>({
    email: '',
    password: '' as any,
    firstName: '',
    lastName: '',
    phone: '',
    role: 'PATIENT' as any,
    ...initialValues,
  });

  const handleChange = (key: keyof User) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form } as any;
    if (isEdit) delete payload.password;
    onSubmit(payload);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" value={form.email as any} onChange={handleChange('email')} required disabled={!!isEdit} />
        </div>
        {!isEdit && (
          <div>
            <Label htmlFor="password">كلمة المرور</Label>
            <Input id="password" type="password" value={(form as any).password || ''} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value as any }))} required />
          </div>
        )}
        <div>
          <Label htmlFor="firstName">الاسم الأول</Label>
          <Input id="firstName" value={form.firstName as any} onChange={handleChange('firstName')} required />
        </div>
        <div>
          <Label htmlFor="lastName">الاسم الأخير</Label>
          <Input id="lastName" value={form.lastName as any} onChange={handleChange('lastName')} required />
        </div>
        <div>
          <Label htmlFor="phone">الهاتف</Label>
          <Input id="phone" value={form.phone as any} onChange={handleChange('phone')} />
        </div>
        <div>
          <Label htmlFor="role">الدور</Label>
          <Input id="role" value={form.role as any} onChange={handleChange('role')} placeholder="ADMIN | DOCTOR | PATIENT" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={submitting}>{submitting ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
      </div>
    </form>
  );
};

export default Users;

