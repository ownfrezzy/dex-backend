import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { Contract } from 'web3-eth-contract/types';
const { CONTRACT_ABI } = require('./ABI/orderController');

@Injectable()
export class Web3Service {
  private web3Instance: Web3;
  orderControllerContract: Contract;

  constructor(private configService: ConfigService) {
    this.web3Instance = new Web3(
      this.configService.get<string>('WEB3_RPC_ENDPOINT'),
    );
    this.orderControllerContract = new this.web3Instance.eth.Contract(
      CONTRACT_ABI,
      this.configService.get<string>('ORDER_CONTROLLER_ADDRESS'),
    );
  }
}
