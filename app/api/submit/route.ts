import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { message, emotion, location } = await request.json();

    // Validate input
    if (!message || !emotion || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save to database
    const submission = await prisma.submission.create({
      data: {
        message,
        emotion,
        location,
        status: 'pending'
      }
    });

    // Send email notification
    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: process.env.RECIPIENT_EMAIL,
      subject: 'New Footprint Submission',
      html: `
        <h2>New Footprint Submission</h2>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Emotion:</strong> ${emotion}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Status:</strong> Pending</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, submission });
  } catch (error) {
    console.error('Error processing submission:', error);
    return NextResponse.json(
      { error: 'Failed to process submission' },
      { status: 500 }
    );
  }
} 