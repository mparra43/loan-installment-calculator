
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
