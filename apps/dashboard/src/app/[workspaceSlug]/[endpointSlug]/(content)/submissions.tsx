import {SubmissionsTable} from '../_components/table';
import {useEffect, useMemo, useState} from 'react';
import {Transition} from '@/components';
import {Skeleton} from '@formizee/ui';

interface Props {
  endpointId?: string;
}

export const Submissions = (props: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [schema, setSchema] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch schema and data from the API
    const fetchSchemaAndData = async () => {
      try {
        const response = await fetch(`/api/vault/${props.endpointId}`);
        const result = await response.json();

        setSchema(result._metadata.schema);

        // Transform submissions data to flatten the structure for the table
        const transformedData = result.submissions.map(
          (submission: {id: string; data: object}) => ({
            id: submission.id,
            ...submission.data
          })
        );
        setData(transformedData);
      } catch {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSchemaAndData();
  }, []);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: 'id',
        header: 'ID'
      }
    ];

    const schemaColumns = Object.keys(schema).map(key => ({
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1)
    }));

    return [...baseColumns, ...schemaColumns];
  }, [schema]);

  // Render fallback content if data is loading or empty
  if (loading) {
    return (
      <Transition className="flex flex-col py-6 gap-6">
        <Skeleton className="w-full h-56" />
      </Transition>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!data.length) {
    return (
      <Transition className="flex flex-col py-6 gap-6">
        <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-neutral-200 dark:border-neutral-800 h-56">
          <h2 className="font-semibold px-6 pt-6">No data available...</h2>
        </div>
      </Transition>
    );
  }

  return (
    <Transition className="flex flex-col py-6 gap-6">
      <SubmissionsTable columns={columns} data={data} />
    </Transition>
  );
};

export default Submissions;
