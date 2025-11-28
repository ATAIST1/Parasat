import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import logo from 'figma:asset/22fd026accecba7795b910052b9400af1c7bdebf.png';

interface SearchScreenProps {
  onProjectClick: (projectId: string) => void;
}

const industries = ['Fintech', 'AI/ML', 'EdTech', 'HealthTech', 'AgriTech', 'E-commerce'];
const stages = ['Идея', 'MVP', 'PMF', 'Рост', 'Скалирование'];
const locations = ['Алматы', 'Астана', 'Шымкент', 'Казахстан', 'СНГ'];

export default function SearchScreen({ onProjectClick }: SearchScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const toggleFilter = (value: string, list: string[], setter: (list: string[]) => void) => {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
    } else {
      setter([...list, value]);
    }
  };

  const clearFilters = () => {
    setSelectedIndustries([]);
    setSelectedStages([]);
    setSelectedLocations([]);
  };

  const activeFiltersCount =
    selectedIndustries.length + selectedStages.length + selectedLocations.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-slate-900 rounded-lg p-1.5">
            <img src={logo} alt="Parasat Invest" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-gray-900">Поиск</h1>
        </div>
        
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Поиск по названию, отрасли или ключевым словам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="relative flex-shrink-0">
                <Filter className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <SheetHeader>
                <SheetTitle>Фильтры</SheetTitle>
                <SheetDescription>Выберите параметры для поиска проектов</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div>
                  <Label className="mb-3 block">Отрасль</Label>
                  <div className="space-y-3">
                    {industries.map((industry) => (
                      <div key={industry} className="flex items-center space-x-2">
                        <Checkbox
                          id={`industry-${industry}`}
                          checked={selectedIndustries.includes(industry)}
                          onCheckedChange={() =>
                            toggleFilter(industry, selectedIndustries, setSelectedIndustries)
                          }
                        />
                        <label htmlFor={`industry-${industry}`} className="text-sm">
                          {industry}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Стадия</Label>
                  <div className="space-y-3">
                    {stages.map((stage) => (
                      <div key={stage} className="flex items-center space-x-2">
                        <Checkbox
                          id={`stage-${stage}`}
                          checked={selectedStages.includes(stage)}
                          onCheckedChange={() =>
                            toggleFilter(stage, selectedStages, setSelectedStages)
                          }
                        />
                        <label htmlFor={`stage-${stage}`} className="text-sm">
                          {stage}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Локация</Label>
                  <div className="space-y-3">
                    {locations.map((location) => (
                      <div key={location} className="flex items-center space-x-2">
                        <Checkbox
                          id={`location-${location}`}
                          checked={selectedLocations.includes(location)}
                          onCheckedChange={() =>
                            toggleFilter(location, selectedLocations, setSelectedLocations)
                          }
                        />
                        <label htmlFor={`location-${location}`} className="text-sm">
                          {location}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-2">
                <Button variant="outline" onClick={clearFilters} className="flex-1">
                  Сбросить
                </Button>
                <Button className="flex-1">Показать результаты</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {[...selectedIndustries, ...selectedStages, ...selectedLocations].map((filter) => (
              <Badge key={filter} variant="secondary" className="gap-1">
                {filter}
                <button
                  onClick={() => {
                    if (selectedIndustries.includes(filter)) {
                      setSelectedIndustries(selectedIndustries.filter((i) => i !== filter));
                    } else if (selectedStages.includes(filter)) {
                      setSelectedStages(selectedStages.filter((s) => s !== filter));
                    } else {
                      setSelectedLocations(selectedLocations.filter((l) => l !== filter));
                    }
                  }}
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="p-4">
        {activeFiltersCount === 0 && !searchQuery ? (
          <div className="text-center py-16 space-y-3">
            <Search className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-gray-900">Начните поиск</h3>
            <p className="text-gray-600 text-sm">
              Используйте фильтры или введите ключевые слова
            </p>
          </div>
        ) : (
          <div className="text-center py-16 space-y-3">
            <h3 className="text-gray-900">Ничего не найдено</h3>
            <p className="text-gray-600 text-sm">
              Попробуйте изменить фильтры или ключевые слова
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Сбросить фильтры
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}