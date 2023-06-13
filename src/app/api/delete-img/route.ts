import { NextResponse } from "next/server";
import puppeteer from 'puppeteer-core'
import { Browser } from 'puppeteer-core';


async function deleteImage(browser: Browser , imgUrl: string) {
    const page = await browser.newPage();

    await page.goto(imgUrl);
    console.log("Navigated to page");

    await page.click("a.link.link--delete");
    console.log("Clicked the delete link");

    await page.waitForSelector('button[data-action="submit"]', { visible: true });
    console.log("Modal confirmation is visible");

    await page.click('button[data-action="submit"]');
    console.log("Clicked confirm button in modal");
}

export async function POST(req:Request) {
    const {imgDeleteUrl} = await req.json();

    if (!imgDeleteUrl || typeof imgDeleteUrl !== "string" || !imgDeleteUrl.trim()) {
        return NextResponse.json({
            status: 'error',
            message: 'Invalid URL!',
            data: null
        }, { status: 400 });
    }

    let browser;

    try {
        browser = await puppeteer.connect({
            browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BLESS_TOKEN}`,
          })

        await deleteImage(browser, imgDeleteUrl);

        return NextResponse.json({
            status: 'success',
            message: 'Image deleted successfully!',
            data: null
        }, { status: 200 });

    } catch (error) {
    let errorMessage = 'An unexpected error occurred.';
        if (error instanceof Error) {
            errorMessage = `Deletion failed: ${error.message}`;
        }
        return NextResponse.json({
            status: 'error',
            message: errorMessage,
            data: error
        }, { status: 500 });
    } finally {
        if (browser) {
            await browser.close();
          }   
    }
}