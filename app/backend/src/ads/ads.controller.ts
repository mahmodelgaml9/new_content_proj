// // src/ads/ads.controller.ts

// import { Request, Response } from 'express';
// import { adsStrategyService } from './ads.service';
// import { prisma } from '../services/prisma.service';

// class AdsController {
//   public async generateAdCampaign(req: Request, res: Response): Promise<void> {
//     try {
//       const { marketingPlanId } = req.params;

//       const marketingPlan = await prisma.marketingPlan.findUnique({
//         where: { id: marketingPlanId },
//         include: {
//           business: {
//             include: {
//               brandIdentity: true,
//               customerBlueprint: true,
//             },
//           },
//         },
//       });

//       if (!marketingPlan || !marketingPlan.business) {
//         res.status(404).json({ message: 'Marketing plan or business not found.' });
//         return;
//       }

//       const result = await adsStrategyService.generateAdCampaignPlan(
//         marketingPlan,
//         marketingPlan.business
//       );

//       res.status(200).json({ message: 'Ad campaign generated successfully.', data: result });
//     } catch (error) {
//       console.error('Ad campaign generation error:', error);
//       res.status(500).json({ message: 'Error generating ad campaign.' });
//     }
//   }
// }

// export const adsController = new AdsController();
