import {NumberTicker} from '../ticker';

export const Metrics = () => {
  return (
    <section className="flex flex-col w-full items-center justify-center gap-16">
      <div className="flex gap-48 w-5/6 justify-between  border p-4 rounded-lg px-24">
        <span className="flex flex-col items-center gap-4">
          <span>
            <NumberTicker
              className="text-4xl font-bold font-secondary"
              value={12234}
            />
          </span>
          <span className="font-medium font-secondary">Submissions</span>
        </span>
        <span className="flex flex-col items-center gap-4">
          <span>
            <NumberTicker
              className="text-4xl font-bold font-secondary"
              value={108423}
            />
          </span>
          <span className="font-medium font-secondary">API Requests</span>
        </span>
        <span className="flex flex-col items-center gap-4">
          <span>
            <NumberTicker
              className="text-4xl font-bold font-secondary"
              value={103}
            />
          </span>
          <span className="font-medium font-secondary">Endpoints</span>
        </span>
      </div>
    </section>
  );
};
