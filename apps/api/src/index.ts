import {newApp, serve} from '@/lib/hono';
import api from '@/v1';

const app = newApp();

app.route('/v1', api);

serve(app);
