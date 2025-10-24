import React from 'react';
import { AdminLayout } from '@/components/layout';
import { PageHeader } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, PlayCircle, StopCircle, XCircle, Send } from 'lucide-react';
import { useApi, useApiMutation } from '@/hooks/useApi';
import { consultationsService, doctorsService } from '@/services';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CONSULTATION_STATUS, CONSULTATION_STATUS_LABELS, CONSULTATION_PRIORITY, CONSULTATION_PRIORITY_LABELS } from '@/utils/constants';

const Consultations: React.FC = () => {
  const { data, isLoading, refetch } = useApi<any[]>(['consultations'], () => consultationsService.getConsultations().then((d:any)=> Array.isArray(d)? d : (d?.items||[])));

  const [search, setSearch] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [openCreate, setOpenCreate] = React.useState(false);
  const [openMessages, setOpenMessages] = React.useState<null | number>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [priorityFilter, setPriorityFilter] = React.useState<string>('all');

  const startMutation = useApiMutation(({ id, notes }: { id: number; notes?: string }) => consultationsService.start(id, { notes }), { onSuccess: refetch });
  const endMutation = useApiMutation(({ id, notes }: { id: number; notes?: string }) => consultationsService.end(id, { notes }), { onSuccess: refetch });
  const cancelMutation = useApiMutation((id: number) => consultationsService.cancel(id), { onSuccess: refetch });

  const list = React.useMemo(() => (data || []) as any[], [data]);
  const filtered = React.useMemo(() => {
    const matchesSearch = (c: any) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return [c.status, c.subject, c?.doctor?.firstName, c?.patient?.firstName]
        .filter(Boolean)
        .some((v: string) => String(v).toLowerCase().includes(q));
    };
    const matchesStatus = (c: any) => (statusFilter === 'all' ? true : c.status === statusFilter);
    const matchesPriority = (c: any) => (priorityFilter === 'all' ? true : c.priority === priorityFilter);
    return list.filter((c) => matchesSearch(c) && matchesStatus(c) && matchesPriority(c));
  }, [list, search, statusFilter, priorityFilter]);

  const total = filtered.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  const pageData = filtered.slice(start, end);

  const columns = [
    { key: 'subject', title: 'الموضوع', sortable: true },
    { key: 'status', title: 'الحالة', render: (val: string) => (CONSULTATION_STATUS_LABELS as any)[val] || val },
    { key: 'priority', title: 'الأولوية', render: (val: string) => (CONSULTATION_PRIORITY_LABELS as any)[val] || val },
    { key: 'doctor', title: 'الطبيب', render: (_: any, row: any) => row?.doctor?.firstName || row?.doctorId },
    { key: 'patient', title: 'المريض', render: (_: any, row: any) => row?.patient?.firstName || row?.patientId },
    {
      key: 'id',
      title: 'إجراءات',
      render: (_: any, row: any) => (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={() => setOpenMessages(row.id)}>
            <MessageSquare className="h-4 w-4 mr-1" /> رسائل
          </Button>
          <Button size="sm" variant="outline" onClick={() => startMutation.mutate({ id: row.id })}>
            <PlayCircle className="h-4 w-4 mr-1" /> بدء
          </Button>
          <Button size="sm" variant="destructive" onClick={() => cancelMutation.mutate(row.id)}>
            <XCircle className="h-4 w-4 mr-1" /> إلغاء
          </Button>
          <Button size="sm" variant="default" onClick={() => endMutation.mutate({ id: row.id })}>
            <StopCircle className="h-4 w-4 mr-1" /> إنهاء
          </Button>
        </div>
      ),
    },
  ] as any;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <PageHeader title="إدارة الاستشارات" description="عرض وإدارة جميع الاستشارات في النظام">
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> إضافة استشارة
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>إضافة استشارة</DialogTitle>
              </DialogHeader>
              <CreateConsultationForm onSuccess={() => { setOpenCreate(false); refetch(); }} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenCreate(false)}>إلغاء</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </PageHeader>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="w-52">
            <Label className="mb-1 block">الحالة</Label>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {Object.keys(CONSULTATION_STATUS).map((k) => (
                  <SelectItem key={k} value={(CONSULTATION_STATUS as any)[k]}>
                    {(CONSULTATION_STATUS_LABELS as any)[(CONSULTATION_STATUS as any)[k]]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-52">
            <Label className="mb-1 block">الأولوية</Label>
            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v)}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="الكل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {Object.keys(CONSULTATION_PRIORITY).map((k) => (
                  <SelectItem key={k} value={(CONSULTATION_PRIORITY as any)[k]}>
                    {(CONSULTATION_PRIORITY_LABELS as any)[(CONSULTATION_PRIORITY as any)[k]]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(statusFilter !== 'all' || priorityFilter !== 'all' || search) && (
            <Button variant="outline" className="mt-6" onClick={() => { setStatusFilter('all'); setPriorityFilter('all'); setSearch(''); }}>تفريغ الفلاتر</Button>
          )}
        </div>

        <DataTable
          data={pageData}
          columns={columns}
          loading={isLoading}
          searchable
          onSearch={setSearch}
          pagination={{ page, limit, total, onPageChange: setPage, onLimitChange: (l)=>{ setLimit(l); setPage(1); } }}
        />

        {openMessages !== null && (
          <MessagesDialog consultationId={openMessages} onClose={() => setOpenMessages(null)} />
        )}
      </div>
    </AdminLayout>
  );
};

const CreateConsultationForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [form, setForm] = React.useState<{ patientId?: number; doctorId?: number; subject: string; description: string; priority: 'LOW'|'MEDIUM'|'HIGH'|'URGENT' }>({ subject: '', description: '', priority: 'LOW' });
  const [doctors, setDoctors] = React.useState<any[]>([]);

  React.useEffect(() => {
    doctorsService.getDoctors().then((d:any)=> setDoctors(Array.isArray(d)? d : (d?.items||[])));
  }, []);

  const createMutation = useApiMutation(() => consultationsService.createConsultation(form as any), { onSuccess });
  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((p)=> ({ ...p, [k]: e.target.value as any }));
  const submit = (e: React.FormEvent) => { e.preventDefault(); createMutation.mutate(); };

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
        <div className="col-span-2">
          <Label htmlFor="subject">الموضوع</Label>
          <Input id="subject" value={form.subject} onChange={handle('subject')} required />
        </div>
        <div className="col-span-2">
          <Label htmlFor="description">الوصف</Label>
          <Input id="description" value={form.description} onChange={handle('description')} required />
        </div>
        <div>
          <Label htmlFor="priority">الأولوية</Label>
          <Input id="priority" value={form.priority as any} onChange={handle('priority')} placeholder="LOW | MEDIUM | HIGH | URGENT" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={createMutation.isLoading}>{createMutation.isLoading ? 'جارٍ الحفظ...' : 'حفظ'}</Button>
      </div>
    </form>
  );
};

const MessagesDialog: React.FC<{ consultationId: number; onClose: () => void }> = ({ consultationId, onClose }) => {
  const [messages, setMessages] = React.useState<any[]>([]);
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    consultationsService.getMessages(consultationId).then((d:any)=> setMessages(Array.isArray(d)? d : (d?.items||d||[])));
  }, [consultationId]);

  const sendMutation = useApiMutation(() => consultationsService.sendMessage(consultationId, { message }), {
    onSuccess: () => {
      setMessage('');
      consultationsService.getMessages(consultationId).then((d:any)=> setMessages(Array.isArray(d)? d : (d?.items||d||[])));
    },
  });

  return (
    <Dialog open onOpenChange={(o)=> { if(!o) onClose(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>رسائل الاستشارة #{consultationId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 max-h-64 overflow-auto border rounded p-3 bg-muted/30">
          {messages.length ? messages.map((m)=> (
            <div key={m.id} className="text-sm">
              <span className="font-medium">{m.senderType}:</span> {m.content}
            </div>
          )) : (
            <div className="text-sm text-muted-foreground">لا توجد رسائل</div>
          )}
        </div>
        <form className="flex gap-2" onSubmit={(e)=> { e.preventDefault(); sendMutation.mutate(); }}>
          <Input value={message} onChange={(e)=> setMessage(e.target.value)} placeholder="اكتب رسالة..." />
          <Button type="submit" disabled={!message.trim() || sendMutation.isLoading}><Send className="h-4 w-4" /></Button>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>إغلاق</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Consultations;

