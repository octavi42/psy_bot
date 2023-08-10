import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        if (!email || !password) {
          return res.status(400).json({ error: 'Email and password are required' });
        }

        const existUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await hash(password, saltRounds);

        const newUser = await prisma.user.create({
            data: {
              name: name || undefined, // name is optional, so handle it appropriately
              email: email,
              password: hashedPassword,
            },
          });
          
        return NextResponse.json(newUser);

      } else {
        // Handle invalid HTTP methods (only POST is allowed for registration)
        return res.status(405).json({ error: 'Method not allowed' });
      }
}

// export default async function POST(req: NextApiRequest) {

// }