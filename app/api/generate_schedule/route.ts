import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topics, study_time } = body;

    if (!topics || !Array.isArray(topics) || topics.length === 0) {
      return NextResponse.json(
        { error: "Topics must be a non-empty array" },
        { status: 400 }
      );
    }

    if (typeof study_time !== 'number' || study_time <= 0) {
      return NextResponse.json(
        { error: "Study time must be a positive number" },
        { status: 400 }
      );
    }

    // Create schedule with each topic assigned the study time and add a review session.
    const each_topic = Math.round((study_time-1)/topics.length);
    const schedule: { [key: string]: string } = {};
    topics.forEach((_, index) => {
      schedule[index] = `${each_topic}hr`;
    });
    schedule.review = "1hr";

    return NextResponse.json({ schedule });
  } catch (error: any) {
    console.error("Error creating schedule:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create schedule" },
      { status: 500 }
    );
  }
}