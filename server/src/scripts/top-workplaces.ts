import axios from 'axios';

type Workplace = {
  id: number;
  name: string;
  status: number;
};

type Shift = {
  id: number;
  workplaceId: number;
};

type TopWorkplace = {
  name: string;
  shifts: number;
};

async function getTopWorkplaces() {
  try {
    const [workplacesRes, shiftsRes] = await Promise.all([
      axios.get<{ data: Workplace[] }>('http://localhost:3000/workplaces'),
      axios.get<{ data: Shift[] }>('http://localhost:3000/shifts')
    ]);

    const workplaces: Workplace[] = workplacesRes.data.data;
    const shifts: Shift[] = shiftsRes.data.data;

    const activeWorkplaces = workplaces.filter((w: Workplace) => w.status === 0);

    const shiftCount: Record<number, number> = {};
    for (const shift of shifts) {
      shiftCount[shift.workplaceId] = (shiftCount[shift.workplaceId] || 0) + 1;
    }

    const top: TopWorkplace[] = activeWorkplaces
      .map((w: Workplace) => ({
        name: w.name,
        shifts: shiftCount[w.id] || 0
      }))
      .sort((a: TopWorkplace, b: TopWorkplace) => b.shifts - a.shifts)
      .slice(0, 3);

    console.log(JSON.stringify(top, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

getTopWorkplaces();
