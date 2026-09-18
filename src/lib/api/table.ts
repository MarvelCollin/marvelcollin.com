import { supabase } from '../supabase';

export interface Table<T, I> {
  list: () => Promise<T[]>;
  create: (input: I) => Promise<void>;
  update: (id: string, input: I) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

interface Options<T, I, R> {
  name: string;
  order: string;
  sorted?: boolean;
  fromRow?: (row: R) => T;
  toRow?: (input: I) => object;
}

function check(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

async function nextSort(name: string): Promise<number> {
  const { data } = await supabase.from(name).select('sort').order('sort', { ascending: false }).limit(1);
  const top = (data as { sort: number }[] | null)?.[0]?.sort;
  return typeof top === 'number' ? top + 1 : 0;
}

export function table<T, I, R = T>({ name, order, sorted = false, fromRow, toRow }: Options<T, I, R>): Table<T, I> {
  const read = fromRow ?? ((row: R) => row as unknown as T);
  const write = toRow ?? ((input: I) => input as object);

  return {
    async list() {
      const { data, error } = await supabase.from(name).select('*').order(order, { ascending: true });
      check(error);
      return ((data ?? []) as R[]).map(read);
    },
    async create(input) {
      const row = sorted ? { ...write(input), sort: await nextSort(name) } : write(input);
      check((await supabase.from(name).insert(row)).error);
    },
    async update(id, input) {
      check((await supabase.from(name).update(write(input)).eq('id', id)).error);
    },
    async remove(id) {
      check((await supabase.from(name).delete().eq('id', id)).error);
    },
  };
}
