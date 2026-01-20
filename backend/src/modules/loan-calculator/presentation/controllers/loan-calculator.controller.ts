import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiTags, ApiResponse } from '@nestjs/swagger'
import { LoanCalculatorService } from '../../application/services/loan-calculator.service'
import { CalculateLoanDto } from '../dto/calculate-loan.dto'
import { LoanResponseDto } from '../dto/loan-response.dto'
import { LoanListResponseDto } from '../dto/loan-list-response.dto'

@ApiTags('loan-calculator')
@Controller('loans')
export class LoanCalculatorController {
  constructor(private readonly service: LoanCalculatorService) {}

  @Post()
  @ApiResponse({ status: 201, type: LoanResponseDto })
  async create(@Body() dto: CalculateLoanDto): Promise<LoanResponseDto> {
    return this.service.calculate(dto)
  }

  @Get()
  @ApiResponse({ status: 200, type: [LoanListResponseDto] })
  async list(): Promise<LoanListResponseDto[]> {
    return this.service.findAll()
  }
}