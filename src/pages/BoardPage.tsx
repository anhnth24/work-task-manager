import { Board } from '@/components/board/Board';
import { FilterBar } from '@/components/board/FilterBar';

export function BoardPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 pb-0">
        <FilterBar />
      </div>
      <Board />
    </div>
  );
}
