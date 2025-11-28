import { ArrowLeft, Upload, FileText, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface BusinessFormProps {
    onBack: () => void;
    onSubmit: () => void;
}

interface Document {
    name: string;
    size: string;
    type: string;
}

interface DocumentFiles {
    memorandum: Document | null;
    financialReport: Document | null;
    businessPlan: Document | null;
    presentation: Document | null;
    other: Document[];
}

export default function BusinessForm({ onBack, onSubmit }: BusinessFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        industry: '',
        location: '',
        founded: '',
        description: '',
        revenue: '',
        profit: '',
        employees: '',
        investmentNeeded: '',
        investmentGoal: '',
        equity: '',
    });

    const [documents, setDocuments] = useState<DocumentFiles>({
        memorandum: null,
        financialReport: null,
        businessPlan: null,
        presentation: null,
        other: [],
    });

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docType: keyof DocumentFiles) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            const newDoc: Document = {
                name: file.name,
                size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
                type: file.type.split('/')[1]?.toUpperCase() || 'FILE',
            };

            if (docType === 'other') {
                setDocuments({ ...documents, other: [...documents.other, newDoc] });
            } else {
                setDocuments({ ...documents, [docType]: newDoc });
            }
            toast('Документ добавлен');
        }
    };

    const handleRemoveDocument = (docType: keyof DocumentFiles, index?: number) => {
        if (docType === 'other' && index !== undefined) {
            setDocuments({
                ...documents,
                other: documents.other.filter((_, i) => i !== index),
            });
        } else {
            setDocuments({ ...documents, [docType]: null });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.industry || !formData.location || !formData.description) {
            toast('Пожалуйста, заполните все обязательные поля');
            return;
        }

        toast('Инвестиционный запрос создан');
        onSubmit();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-gray-900 font-medium">Запрос на инвестиции</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 pb-24 space-y-6 max-w-2xl mx-auto">
                {/* Основная информация */}
                <div className="bg-white rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-medium text-gray-900">Основная информация</h3>

                    <div className="space-y-2">
                        <Label htmlFor="name">Название бизнеса *</Label>
                        <Input
                            id="name"
                            placeholder="Например: Сеть кофеен CoffeeHub"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">Индустрия *</Label>
                        <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Выберите индустрию" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HoReCa">HoReCa (рестораны, кафе)</SelectItem>
                                <SelectItem value="Ритейл">Ритейл</SelectItem>
                                <SelectItem value="Логистика">Логистика</SelectItem>
                                <SelectItem value="Производство">Производство</SelectItem>
                                <SelectItem value="Строительство">Строительство</SelectItem>
                                <SelectItem value="Фитнес">Фитнес и спорт</SelectItem>
                                <SelectItem value="Образование">Образование</SelectItem>
                                <SelectItem value="Здравоохранение">Здравоохранение</SelectItem>
                                <SelectItem value="Маркетинг">Маркетинг и реклама</SelectItem>
                                <SelectItem value="IT-услуги">IT-услуги</SelectItem>
                                <SelectItem value="Недвижимость">Недвижимость</SelectItem>
                                <SelectItem value="Другое">Другое</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Локация *</Label>
                            <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Город" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Алматы">Алматы</SelectItem>
                                    <SelectItem value="Астана">Астана</SelectItem>
                                    <SelectItem value="Шымкент">Шымкент</SelectItem>
                                    <SelectItem value="Караганда">Караганда</SelectItem>
                                    <SelectItem value="Актобе">Актобе</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="founded">Год основания</Label>
                            <Input
                                id="founded"
                                placeholder="2019"
                                value={formData.founded}
                                onChange={(e) => setFormData({ ...formData, founded: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Описание бизнеса *</Label>
                        <Textarea
                            id="description"
                            placeholder="Опишите ваш бизнес, его особенности и преимущества..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                        />
                    </div>
                </div>

                {/* Финансовые показатели */}
                <div className="bg-white rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-medium text-gray-900">Финансовые показатели</h3>
                    <p className="text-sm text-gray-600">Укажите годовые показатели в тенге</p>

                    <div className="space-y-2">
                        <Label htmlFor="revenue">Годовая выручка (₸)</Label>
                        <Input
                            id="revenue"
                            placeholder="180000000"
                            value={formData.revenue}
                            onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="profit">Чистая прибыль (₸)</Label>
                        <Input
                            id="profit"
                            placeholder="36000000"
                            value={formData.profit}
                            onChange={(e) => setFormData({ ...formData, profit: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="employees">Количество сотрудников</Label>
                        <Input
                            id="employees"
                            placeholder="45"
                            value={formData.employees}
                            onChange={(e) => setFormData({ ...formData, employees: e.target.value })}
                        />
                    </div>
                </div>

                {/* Инвестиционный запрос */}
                <div className="bg-white rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-medium text-gray-900">Инвестиционный запрос</h3>

                    <div className="space-y-2">
                        <Label htmlFor="investmentNeeded">Запрашиваемая сумма (₸)</Label>
                        <Input
                            id="investmentNeeded"
                            placeholder="50000000"
                            value={formData.investmentNeeded}
                            onChange={(e) => setFormData({ ...formData, investmentNeeded: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="investmentGoal">Цель инвестиций</Label>
                        <Textarea
                            id="investmentGoal"
                            placeholder="Например: Открытие 5 новых точек в Астане"
                            value={formData.investmentGoal}
                            onChange={(e) => setFormData({ ...formData, investmentGoal: e.target.value })}
                            rows={3}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="equity">Предлагаемая доля (%)</Label>
                        <Input
                            id="equity"
                            placeholder="15"
                            value={formData.equity}
                            onChange={(e) => setFormData({ ...formData, equity: e.target.value })}
                        />
                    </div>
                </div>

                {/* Документы */}
                <div className="bg-white rounded-2xl p-6 space-y-5">
                    <h3 className="text-lg font-medium text-gray-900">Документы</h3>
                    <p className="text-sm text-gray-600">Добавьте подтверждающие документы</p>

                    <div className="space-y-4">

                        {/* Меморандум */}
                        <div className="space-y-2">
                            <input id="memorandum" type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'memorandum')} className="hidden" />
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => document.getElementById('memorandum')?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Инвестиционный меморандум
                            </Button>
                            {documents.memorandum && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{documents.memorandum.name}</p>
                                            <p className="text-xs text-gray-500">{documents.memorandum.type} • {documents.memorandum.size}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveDocument('memorandum')} className="p-1 hover:bg-gray-200 rounded">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Финансовый отчет */}
                        <div className="space-y-2">
                            <input id="financialReport" type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'financialReport')} className="hidden" />
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => document.getElementById('financialReport')?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Финансовый отчет
                            </Button>
                            {documents.financialReport && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{documents.financialReport.name}</p>
                                            <p className="text-xs text-gray-500">{documents.financialReport.type} • {documents.financialReport.size}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveDocument('financialReport')} className="p-1 hover:bg-gray-200 rounded">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Бизнес-план */}
                        <div className="space-y-2">
                            <input id="businessPlan" type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'businessPlan')} className="hidden" />
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => document.getElementById('businessPlan')?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Бизнес-план
                            </Button>
                            {documents.businessPlan && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{documents.businessPlan.name}</p>
                                            <p className="text-xs text-gray-500">{documents.businessPlan.type} • {documents.businessPlan.size}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveDocument('businessPlan')} className="p-1 hover:bg-gray-200 rounded">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Презентация */}
                        <div className="space-y-2">
                            <input id="presentation" type="file" accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'presentation')} className="hidden" />
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => document.getElementById('presentation')?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Презентация
                            </Button>
                            {documents.presentation && (
                                <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm font-medium">{documents.presentation.name}</p>
                                            <p className="text-xs text-gray-500">{documents.presentation.type} • {documents.presentation.size}</p>
                                        </div>
                                    </div>
                                    <button type="button" onClick={() => handleRemoveDocument('presentation')} className="p-1 hover:bg-gray-200 rounded">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Другие документы */}
                        <div className="space-y-2">
                            <input id="documents" type="file" multiple accept=".pdf,.doc,.docx,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 'other')} className="hidden" />
                            <Button type="button" variant="outline" className="w-full justify-start" onClick={() => document.getElementById('documents')?.click()}>
                                <Upload className="w-4 h-4 mr-2" />
                                Другие документы
                            </Button>

                            {documents.other.length > 0 && (
                                <div className="space-y-2">
                                    {documents.other.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-5 h-5 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium">{doc.name}</p>
                                                    <p className="text-xs text-gray-500">{doc.type} • {doc.size}</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => handleRemoveDocument('other', index)} className="p-1 hover:bg-gray-200 rounded">
                                                <X className="w-4 h-4 text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Предупреждение */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
                    <p className="text-sm text-blue-800">
                        <strong>Важно:</strong> Убедитесь, что все финансовые данные точны и актуальны. Инвесторы могут запросить подтверждающие документы.
                    </p>
                </div>


                {/* Кнопка публикации*/}
                <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-5 z-50 shadow-2xl">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-r rounded-2xl blur opacity-40 group-hover:opacity-60 transition duration-500"></div>

                        <Button
                            type="submit"
                            className="relative w-full h-14 text-base font-medium bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-lg transition-all duration-300"
                            size="lg"
                        >
                            Опубликовать запрос
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}