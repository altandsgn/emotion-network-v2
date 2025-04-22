import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Enhanced in-memory cache with better key management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to generate a consistent cache key
function generateCacheKey(url: string): string {
  const { searchParams } = new URL(url);
  const params = new URLSearchParams(searchParams);
  // Sort parameters to ensure consistent key generation
  params.sort();
  return `submissions:${params.toString()}`;
}

export async function GET(request: Request) {
  try {
    const cacheKey = generateCacheKey(request.url);

    // Check cache with timestamp validation
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const emotions = searchParams.get('emotions')?.split(',') || [];
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {
      status: 'approved'
    };

    if (emotions.length > 0) {
      where.emotion = { in: emotions };
    }

    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          message: true,
          emotion: true,
          location: true,
          createdAt: true
        }
      }),
      prisma.submission.count({ where })
    ]);

    const response = {
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    // Cache the response with timestamp
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
} 