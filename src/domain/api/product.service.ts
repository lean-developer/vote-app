import http from './server/http'
import { Master } from '../models/master'
import { Member, MemberState } from '../models/member';
import { Vote } from '../models/vote';
import { MemberVote } from '../models/memberVote';
import { MemberVoteValue } from '../models/memberVoteValue';
import { MemberVoteResult } from '../models/memberVoteResult';
import { Product } from '../models/product';
import { DeleteResult } from '../models/deleteResult';

class ProductService {
    async createProductForMaster (masterId: number, name: string): Promise<Product | undefined> {
        try {
          if (!name) {
            return;
          }
          const api = 'product/master/' + masterId + '?name=' + name
          const resp = await http.post(api)
          return resp.data as Product
        } catch (e) {
          console.error(e)
        }
      }

    async updateProduct (product: Product): Promise<Product | undefined> {
        try {
            const api = 'product/';
            const resp = await http.patch(api, product);
            return resp.data as Product;
        } catch (e) {
            console.error(e)
        }
    }

    async deleteProduct (id: number): Promise<DeleteResult | undefined> {
        try {
          const api = 'product/' + id
          const resp = await http.delete(api)
          return resp.data as DeleteResult
        } catch (e) {
          console.error(e)
        }
      }
}

export default new ProductService()