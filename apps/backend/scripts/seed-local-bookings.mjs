import 'dotenv/config';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (
    !databaseUrl ||
    !['localhost', '127.0.0.1', '[::1]'].includes(new URL(databaseUrl).hostname)
) {
    throw new Error('Sample bookings can only be added to a local database.');
}

const client = new pg.Client({ connectionString: databaseUrl });
const names = [
    'Alex Morgan',
    'Emma Wilson',
    'Noah Taylor',
    'Mia Brown',
    'Liam Davis',
    'Sofia Martin',
];
const statuses = [
    'pending',
    'confirmed',
    'confirmed',
    'cancelled_by_user',
    'pending',
    'cancelled_by_admin',
];
const notes = [
    'First visit. Please send a reminder before the appointment.',
    'Follow-up consultation to review the available options.',
    'A group booking. We would like to discuss the details together.',
    'Customer asked to move the appointment to next week.',
    'Please call in the afternoon to confirm the time.',
    '',
];

await client.connect();
try {
    await client.query('BEGIN');
    const { rows: forms } = await client.query(
        `SELECT f.id FROM booking_forms f
         JOIN organizations o ON o.id = f.organization_id
         WHERE o.name = 'Bookio' AND f.slug = 'sales'`,
    );
    if (forms.length !== 1)
        throw new Error(
            'Expected one Sales form in the local Bookio organization.',
        );
    const formId = forms[0].id;
    let inserted = 0;

    for (let index = 0; index < 24; index++) {
        const variant = index % names.length;
        const id = `00000000-b00c-4000-8000-${String(index + 1).padStart(12, '0')}`;
        const createdAt = new Date(
            Date.UTC(2026, 9, 12, 12, 0) - index * 3_600_000,
        );
        const data = {
            text: `Demo: ${names[variant]}`,
            area: notes[variant],
            email: `${names[variant].toLowerCase().replace(' ', '.')}@example.com`,
            phone:
                variant === 5
                    ? ''
                    : `+37529000${String(index + 1).padStart(4, '0')}`,
            url: variant === 2 ? 'https://example.com/group-booking' : '',
            number: variant,
            select: ['one', 'two', 'three'][index % 3],
            sure: variant !== 3,
            radio: index % 2 ? 'two' : 'one',
            date: `2026-10-${String(13 + (index % 18)).padStart(2, '0')}`,
            time: ['09:00', '10:30', '12:00', '14:15', '16:00', '18:30'][
                variant
            ],
        };
        const result = await client.query(
            `INSERT INTO bookings (id, booking_form_id, status, data, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $5) ON CONFLICT (id) DO NOTHING`,
            [id, formId, statuses[variant], JSON.stringify(data), createdAt],
        );
        inserted += result.rowCount;
    }

    const { rows: counts } = await client.query(
        'SELECT count(*)::int AS total FROM bookings WHERE booking_form_id = $1',
        [formId],
    );
    await client.query(
        'UPDATE booking_forms SET total_bookings = $1, updated_at = now() WHERE id = $2',
        [counts[0].total, formId],
    );
    await client.query('COMMIT');
    console.log(
        `Added ${inserted} sample bookings. Sales now has ${counts[0].total} bookings.`,
    );
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    await client.end();
}
