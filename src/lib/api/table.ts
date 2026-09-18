import { SUPABASE_KEY, SUPABASE_URL } from '../env';

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

const client = async () => (await import('../supabase')).supabase;

async function fetchRows<R>(name: string, order: string): Promise<R[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${name}?select=*&order=${order}.asc`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
  });
  if (!res.ok) throw new Error(`Failed to load ${name} (${res.status})`);
  return res.json();
}

async function nextSort(name: string): Promise<number> {
  const { data } = await (await client()).from(name).select('sort').order('sort', { ascending: false }).limit(1);
  const top = (data as { sort: number }[] | null)?.[0]?.sort;
  return typeof top === 'number' ? top + 1 : 0;
}

export function table<T, I, R = T>({ name, order, sorted = false, fromRow, toRow }: Options<T, I, R>): Table<T, I> {
  const read = fromRow ?? ((row: R) => row as unknown as T);
  const write = toRow ?? ((input: I) => input as object);

  return {
    async list() {
      return (await fetchRows<R>(name, order)).map(read);
    },
    async create(input) {
      const row = sorted ? { ...write(input), sort: await nextSort(name) } : write(input);
      check((await (await client()).from(name).insert(row)).error);
    },
    async update(id, input) {
      check((await (await client()).from(name).update(write(input)).eq('id', id)).error);
    },
    async remove(id) {
      check((await (await client()).from(name).delete().eq('id', id)).error);
    },
  };
}
