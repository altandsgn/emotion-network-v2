import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Simple in-memory cache for admin submissions
const adminCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cacheKey = request.url; // Use the full URL as cache key

    // Check cache
    const cached = adminCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return NextResponse.json(cached.data);
    }

    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') || 'pending';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = {};
    if (status !== 'all') {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { message: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { emotion: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get submissions with pagination
    const [submissions, total] = await Promise.all([
      prisma.submission.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.count({ where })
    ]);

    const response = {
      submissions,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };

    // Cache the response
    adminCache.set(cacheKey, {
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