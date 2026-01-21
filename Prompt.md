
## 📦 Domain Layer

### 1. Value Objects (`value-objects`)
- **PaymentVO**  
  Encapsula la información de cada cuota del préstamo.  
  Campos: `month`, `payment`, `principal`, `interest`, `balance`.  
  Responsabilidades: validar que los valores sean positivos y coherentes entre sí (ej. `principal + interest = payment`).

### 2. Entities (`entities`)
- **LoanCalculation (entidad de dominio)**  
  Atributos: `id`, `amount`, `interestRate`, `termInMonths`, `totalAmount`, `monthlyPayment`, `totalInterest`, `payments: PaymentVO[]`, `createdAt`.  
  Comportamiento:  
  – Calcular la cuota fija mensual (amortización francesa).  
  – Calcular el total de intereses pagados.  
  – Generar el cronograma completo de pagos.  
  – Garantizar invariantes: monto > 0, tasa ≥ 0, plazo > 0 meses.

### 3. Repositories (`repositories`)
- **ILoanCalculationRepository**  
  Interfaz de dominio que expone:  
  – `save(loan: LoanCalculation): Promise<LoanCalculation>`  
  – `findAll(): Promise<LoanCalculation[]>`  
  – `findById(id: string): Promise<LoanCalculation | null>`

### 4. Infraestructura (`infrastructure`)
- **LoanCalculationTypeOrmEntity**  
  Entidad TypeORM que refleja la tabla `loan_calculations`.  
  Campos: `amount`, `termMonths`, `interestRate`, `interestType`, `monthlyPayment`, `totalInterest`, `totalPayment`, `createdAt`.  
  Configuraciones: tipos de columna, longitudes, índices y preparación para migraciones.

- **Migraciones**  
  Generar migración inicial:  
  `npm run migration:generate -- -n CreateLoanCalculationsTable`

- **LoanCalculationTypeOrmRepository**  
  Implementa `ILoanCalculationRepository` adaptando la entidad TypeORM al modelo de dominio.

---

## 🚚 Application Layer

### DTOs (`dto`) – todos con `@ApiProperty`

| Archivo | Propósito | Campos |
|---------|-----------|--------|
| `calculate-loan.dto.ts` | Entrada del endpoint POST | `amount: number`, `interestRate: number`, `termInMonths: number` |
| `payment.dto.ts` | Representa una cuota | `month`, `payment`, `principal`, `interest`, `balance` |
| `loan-response.dto.ts` | Salida del cálculo único | `totalAmount`, `monthlyPayment`, `totalInterest`, `payments: PaymentDto[]` |
| `loan-list-response.dto.ts` | Elemento del historial | `amount`, `termMonths`, `interestRate`, `interestType`, `totalInterest`, `totalPayment`, `monthlyPayment` |

---

## 🎮 Presentation Layer

### Servicio (`loan-calculator.service.ts`)
- **`calculate(dto: CalculateLoanDto): Promise<LoanResponseDto>`**  
  – Ejecuta la lógica de negocio.  
  – Persiste el resultado mediante el repositorio de dominio.  
  – Retorna el DTO de respuesta.

- **`findAll(): Promise<LoanListResponseDto[]>`**  
  – Consulta el repositorio y devuelve el historial completo mapeado a DTOs.

### Controlador (`loan-calculator.controller.ts`)
- **POST /loans/calculate**  
  Recibe `CalculateLoanDto` → invoca servicio → retorna `LoanResponseDto`.

- **GET /loans**  
  Retorna `LoanListResponseDto[]` con el historial de cálculos.

---

## 📖 Documentación API (Swagger)

Configurar en `main.ts` (o módulo correspondiente):


## ⚡ Backend Optimization (Cache)

### 1. Servicio de Caché (`cache.service.ts`)
- Implementar un servicio de caché in-memory que abstraiga la implementación concreta del almacenamiento.
- Debe exponer métodos claros como: `get`, `set`, `delete` y `clear`.

### 2. Infraestructura (`InfrastructureModule`)
- Configurar el módulo de infraestructura para registrar el servicio de caché.
- Obtener el TTL desde variables de entorno definidas en el archivo `.env`.
- Inyectar el valor del TTL de forma tipada y centralizada.

### 3. Servicio de Dominio (`loan-calculator.service.ts`)
- **Estrategia**:
  1. Generar una clave de caché basada en los parámetros de entrada: monto, tasa, plazo.
  2. Consultar el caché para verificar si el resultado ya existe.
  3. Retornar el valor almacenado sin recalcular.
  4. Si no existe: Ejecutar el cálculo y guardar el resultado en caché usando el TTL configurado.
- Mantener la lógica de caché como una optimización, sin alterar el 

---


## 🎨 Frontend Layer

### 1. Configuración Inicial
- **TailwindCSS**: Configurar estilos globales y utilidades base. Asegurar compatibilidad con `react-compiler`.
- **Estructura de Carpetas**: `src/{components, pages, routes, schemas, ui}`.
- **Routing**: Configurar React Router con rutas `/` (Home) y `/historial` (History).

### 2. Componentes Reutilizables (`components`)

#### `InputNumber`
- Manejo de errores y labels.

#### `Button`
Props:
```typescript
interface ButtonProps {
  label: string;
  type?: ButtonType;
  onClick?: () => void;
  disabled?: boolean;
}
```

#### `Form`
Formulario reutilizable con integración `react-hook-form` + `zod`.
Props:
```typescript
type FieldConfig = {
  label: string;
  name: string;
  placeholder?: string;
  type?: "text" | "number";
  rules?: RegisterOptions;
  inputType: "text" | "date";
};

interface FormProps {
  schema: ZodSchema<any>;
  fields: FieldConfig[];
  buttonProps: {
    label: string;
    type?: "submit" | "button";
    variant?: "primary" | "secondary";
    floating?: boolean;
    disabled?: boolean;
  };
  onSubmit: (data: any) => void;
  defaultValues?: any;
}
```

#### `Table`
- Recibe columnas y datos por props.
- Renderiza diferentes tipos de datos dinámicamente.

### 3. Páginas (`pages`)

#### Home (`/`)
- Formulario de cálculo de préstamos usando el componente `Form`.
- Campos:
  - Monto
  - Tasa de interés mensual
  - Plazo (en meses)
- **Acción**: Enviar petición POST usando `loan-installment-calculator.ts`.

#### History (`/historial`)
- Visualización del historial de préstamos.
- **Acción**: Obtener datos GET usando `loan-installment-calculator.ts`.

### 4. Integración API (`services`)

#### `base-api.ts`
- Interceptor global con Axios.
- Manejo centralizado de errores (4xx, 5xx, timeouts).
- Reutilización de instancia base.

#### `loan-installment-calculator.ts`
- **POST /loans**: Crear cálculo/préstamo.
- **GET /loans**: Obtener historial.
- Tipado estricto de request/response.

---

## 🛠  Refactor
 Modificar `HomePage.tsx` para usar `loanService` en el envío del formulario.
-Modificar `HistoryPage.tsx` para usar `loanService` en la obtención del historial.