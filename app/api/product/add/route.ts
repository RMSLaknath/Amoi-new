import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { getAdminAuthUser } from '@/lib/auth'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const user = await getAdminAuthUser(req)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = Number(formData.get('price'))
    const category = formData.get('category') as string
    const subcategory = formData.get('subcategory') as string
    const sizes = JSON.parse(formData.get('sizes') as string) as string[]
    const bestseller = formData.get('bestseller') === 'true'

    const imageUrls: string[] = []
    for (let i = 1; i <= 4; i++) {
      const file = formData.get(`image${i}`) as File | null
      if (file && file.size > 0) {
        const url = await uploadImage(file)
        imageUrls.push(url)
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ success: false, message: 'At least one image is required' }, { status: 400 })
    }

    const ref = await db.collection('products').add({
      name,
      description,
      price,
      category,
      subcategory,
      sizes,
      bestseller,
      image: imageUrls,
      date: Date.now(),
    })

    return NextResponse.json({ success: true, productId: ref.id })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
