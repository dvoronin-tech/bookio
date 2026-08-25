---
name: change-field-params
description: Change Bookio booking-form field `params` shapes (TypeScript types, Zod schemas, FieldModal UI config, public-form consumers). Use when adding, removing, or splitting param keys such as placeholder, helpText, options, rows; when editing date/input/textarea/select/radio/checkbox/file/group params; or when the user asks to change field params schema.
disable-model-invocation: true
---

# Change booking-form field params

`params` is the per-type JSON blob on `booking_form_fields.params`. Shape is **discriminated by `field.type`**. Do not treat all fields as `InputFieldParams`.

## Pipeline (always this order)

```
@bookio/db types          packages/db/src/schema/field-params.ts
        ↓  FieldParamsMap[type]
Zod schemas               apps/backend/src/schemas/bookingFormFields/shared.schema.ts
        ↓  satisfies z.ZodType<XParams>
        ↓  wired in buildBookingFormFieldVariants
sync schema               apps/backend/src/schemas/bookingFormFields/sync.schema.ts
        ↓  same builder, same param schema args
FieldModal UI             apps/frontend/src/utils/paramsFieldConfig/
        ↓  Record<keyof z.infer<typeof xParamsSchema>, …>
public form               apps/booking-form/src/components/Fields/<Type>Field
```

Then **rebuild db** (`@bookio/db` exports `dist/`, not source):

```bash
pnpm --filter @bookio/db build
pnpm --filter @bookio/backend typecheck
pnpm --filter @bookio/frontend exec tsc --noEmit
```

JSONB in Postgres is not migrated automatically. Extra keys on old rows stay until the next field sync. Zod **strips unknown keys** on parse — do not add a DB migration unless asked.

## Source of truth

| Layer | File | Role |
|---|---|---|
| Field type literals | `packages/db/src/schema/fields.ts` → `fieldTypeValues` | Adding a **new field type** (not just params). Out of scope for a params-only change. |
| Param **types** | `packages/db/src/schema/field-params.ts` | `XFieldParams` + `FieldParamsMap`. `BookingFormFieldRow<T>['params']` comes from here. |
| Param **Zod** | `apps/backend/src/schemas/bookingFormFields/shared.schema.ts` | `xParamsSchema` + `buildBookingFormFieldVariants`. Re-exported via `@bookio/backend/schemas`. |
| Sync payload | `apps/backend/src/schemas/bookingFormFields/sync.schema.ts` | Must pass the same param schemas into the builder. `createModalFieldSchema` is an alias of the sync item schema. |
| Modal widgets | `apps/frontend/src/utils/paramsFieldConfig/fields/*.ts` | One config per **params schema**, keyed by `keyof z.infer<typeof schema>`. |
| Modal wiring | `apps/frontend/src/utils/paramsFieldConfig/paramsFieldConfig.ts` | Maps `field.type` → config. |
| Modal widget unions | `apps/frontend/src/utils/paramsFieldConfig/paramsFieldConfig.types.ts` | `ParamsFieldConfig[type]` — update if the UI widget kind changes. |
| Modal render | `apps/frontend/src/components/FieldModal/ParamFields/ParamFields.tsx` | `params.${name}` via `SimpleParamInput`; `type: 'options'` → `ChoiceOptionsField`; `type: 'select'` → `AcceptTypesField`. |
| Public form | `apps/booking-form/src/components/Fields/` | Read `field.params.*` on the narrowed type. |

## Current type → params slot

Shared slot **`inputParams` / `InputFieldParams` / `inputParamsSchema` / `inputFieldsConfig`**:

`text`, `email`, `phone`, `url`, `number`, `time`

Dedicated slots (change one type without touching the others):

| `type` | TS | Zod | UI config file | Public renderer |
|---|---|---|---|---|
| `date` | `DateFieldParams` | `dateParamsSchema` | `fields/date.ts` | `DateInputField` |
| `textarea` | `TextAreaFieldParams` | `textAreaParamsSchema` | `fields/textarea.ts` | `TextAreaField` |
| `select` | `SelectFieldParams` | `selectParamsSchema` | `fields/choice.ts` (`selectFieldsConfig`) | `SelectField` |
| `radio` | `ChoiceFieldParams` | `choiceParamsSchema` | `fields/choice.ts` (`choiceFieldsConfig`) | `RadioField` |
| `checkbox` | `CheckboxFieldParams` | `checkboxParamsSchema` | `fields/checkbox.ts` | `CheckboxField` |
| `image` | `FileFieldParams` | `fileParamsSchema` | `fields/image.ts` | `FieldPlaceholder` |
| `file` | `FileFieldParams` | `fileParamsSchema` | commented out in `paramsFieldConfig` | `FieldPlaceholder` |
| `group` | `GroupFieldParams` | `groupParamsSchema` | `fields/group.ts` | `BookingForm` group header (`params.description`) |

**Rule:** if the user asks to change params for **one** of `text|email|phone|url|number|time`, either change the shared `InputFieldParams` (affects all six) **or split** that type onto its own slot (same pattern as `date`).

## Builder (do not drift)

`buildBookingFormFieldVariants` in `shared.schema.ts` is the only list of Zod branches. `leafField('date', dateParams)` vs `leafField('time', inputParams)` is what makes date ≠ time.

Both call sites must pass **every** slot, including `dateParams`:

1. `createInputFieldVariants` in `shared.schema.ts`
2. `syncBookingFormFieldItemSchema` in `sync.schema.ts`

Each Zod object uses `satisfies z.ZodType<MatchingTsParams>`.

Frontend configs lock keys to Zod:

```ts
type DateParamKey = keyof z.infer<typeof dateParamsSchema>;
export const dateFieldsConfig: Record<DateParamKey, BaseUIFieldConfig> = { /* … */ };
```

`namedParamFields(config)` copies object keys onto `name` for `register('params.' + name)`. Second argument skips naming for widget types (`namedParamFields(selectFieldsConfig, 'options')`).

`FieldModal` submit runs `createModalFieldSchema.safeParse` (`useFieldModalSubmit.ts`). Invalid params never reach the store.

## Checklists

### A. Add/remove a key on an **existing dedicated** shape (e.g. date, checkbox)

```
- [ ] Edit `XFieldParams` in field-params.ts
- [ ] Edit `xParamsSchema` in shared.schema.ts (keep satisfies)
- [ ] Edit `fields/<x>.ts` config (Record keys must match zod infer)
- [ ] If the UI widget kind changed, update ParamsFieldConfig in paramsFieldConfig.types.ts
- [ ] Update the booking-form field component that reads that key
- [ ] pnpm --filter @bookio/db build && typecheck backend + frontend
```

`sync.schema.ts` needs no edit unless you added a **new** builder slot.

### B. Add/remove a key on the **shared input** shape

Same as A, but files are `InputFieldParams`, `inputParamsSchema`, `fields/input.ts`. Then update **every** public-form consumer of those types that displays the key (`TextInputField`, `EmailInputField`, `PhoneInputField`, `UrlInputField`, `NumberInputField`; `time` is still `FieldPlaceholder`).

`textarea` **spreads** `inputParamsSchema.shape` — it inherits input keys. If you add `helpText`/`placeholder` behavior, check `textAreaParamsSchema` and `fields/textarea.ts` too.

### C. Split one type off a shared shape (this is how date lost `helpText`)

Goal: type T must not share `InputFieldParams` anymore.

```
- [ ] Add `TFieldParams` in field-params.ts (only the keys T should keep)
- [ ] Set FieldParamsMap[T] = TFieldParams
- [ ] Add `tParamsSchema` + `satisfies z.ZodType<TFieldParams>`
- [ ] Add TParams to BuildFieldVariantsOptions AND the function generic AND the BuildFieldVariantsOptions<…> type args (all three lists)
- [ ] Destructure tParams; leafField('t', tParams)
- [ ] Pass tParams: tParamsSchema.default({}) in BOTH builder call sites
- [ ] Add fields/t.ts from keyof z.infer<typeof tParamsSchema>
- [ ] Point paramsFieldConfig[T] at namedParamFields(tFieldsConfig)
- [ ] Rebuild db + typecheck
- [ ] Public-form component: stop reading removed keys (TS will fail if you forget)
```

Do **not** change `InputFieldParams` when the user only wants T to drop a key.

### D. New field **type** (not this skill)

Also: `fieldTypeValues`, drizzle enum, `FieldsMap`, FieldModal type selector/icons, possibly a new builder slot. Ask before expanding scope.

## Worked example: date without `helpText`

Date used to share `inputParams` (`placeholder` + `helpText`). It now has its own slot with **only** `placeholder`.

Files that changed:

1. `packages/db/src/schema/field-params.ts` — `DateFieldParams = { placeholder?: string }`; `FieldParamsMap.date = DateFieldParams`.
2. `apps/backend/src/schemas/bookingFormFields/shared.schema.ts` — `dateParamsSchema`; new `TDateParams` / `dateParams` on the builder; `leafField('date', dateParams)`; `dateParams: dateParamsSchema.default({})` on `createInputFieldVariants`.
3. `apps/backend/src/schemas/bookingFormFields/sync.schema.ts` — import `dateParamsSchema`; pass `dateParams` into the builder.
4. `apps/frontend/src/utils/paramsFieldConfig/fields/date.ts` — **new**; config has `placeholder` only.
5. `apps/frontend/src/utils/paramsFieldConfig/paramsFieldConfig.ts` — `date: namedParamFields(dateFieldsConfig)` instead of `inputFieldsConfig`.

Files that **must stay** with `helpText` (shared input / textarea / checkbox):

- `InputFieldParams` + `inputParamsSchema` + `fields/input.ts`
- `textAreaParamsSchema` + `fields/textarea.ts`
- `CheckboxFieldParams` + `fields/checkbox.ts`
- `TextInputField`, `EmailInputField`, `PhoneInputField`, `UrlInputField`, `NumberInputField`, `TextAreaField`, `CheckboxField`

`DateInputField` already only passed `placeholder`; no help-text UI on `DatePicker`.

## Do not

- Edit `InputFieldParams` to affect a single type that already has (or should get) a dedicated slot.
- Add a builder slot in `shared.schema.ts` and forget `sync.schema.ts`.
- Add a Zod key without a matching `fields/*.ts` Record key (or the reverse).
- Skip `@bookio/db` build after changing `field-params.ts` — backend will not see the new export.
- Invent a second params path. FieldModal and sync both go through `createModalFieldSchema` / `syncBookingFormFieldItemSchema`.
- “Clean up” `createInputFieldSchema` in `shared.schema.ts` (it only slices the first 8 builder variants). Unrelated to params edits.
