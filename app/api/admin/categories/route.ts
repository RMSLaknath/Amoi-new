import { NextRequest, NextResponse } from 'next/server'
import { db, FieldValue, snapToArr } from '@/lib/firebase'
import { getAuthUser } from '@/lib/auth'

interface Category {
  _id: string
  name: string
  subcategories: string[]
}

export async function GET() {
  try {
    const snap = await db.collection('categories').orderBy('name', 'asc').get()
    return NextResponse.json({ success: true, categories: snapToArr<Category>(snap) })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthUser(req)
    if (!auth?.isAdmin) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    }

    const { action, categoryId, name, subcategory } = await req.json()

    if (action === 'add-category') {
      const existing = await db.collection('categories').where('name', '==', name).limit(1).get()
      if (!existing.empty) {
        return NextResponse.json({ success: false, message: 'Category already exists' }, { status: 409 })
      }
      const ref = await db.collection('categories').add({ name, subcategories: [] })
      return NextResponse.json({ success: true, id: ref.id })
    }

    if (action === 'remove-category') {
      await db.collection('categories').doc(categoryId).delete()
      return NextResponse.json({ success: true })
    }

    if (action === 'add-subcategory') {
      await db.collection('categories').doc(categoryId).update({
        subcategories: FieldValue.arrayUnion(subcategory),
      })
      return NextResponse.json({ success: true })
    }

    if (action === 'remove-subcategory') {
      await db.collection('categories').doc(categoryId).update({
        subcategories: FieldValue.arrayRemove(subcategory),
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Unknown action' }, { status: 400 })
  } catch {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}
