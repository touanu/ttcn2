import type { CourseCategoryDB } from '@interfaces/courseCategory.interface'
import { HttpException } from '@exceptions/HttpException'
import { CourseCategoryModel } from '@models/courseCategory.model'
import { Types } from 'mongoose'
import { injectable } from 'tsyringe'

@injectable()
export class CourseCategoryService {
  /**
   * Tạo danh mục khóa học mới
   */
  public async createCategory(categoryData: Partial<CourseCategoryDB>): Promise<CourseCategoryDB> {
    const newCategory = await CourseCategoryModel.create(categoryData)
    return newCategory
  }

  /**
   * Lấy tất cả danh mục
   */
  public async getAllCategories(): Promise<CourseCategoryDB[]> {
    return CourseCategoryModel.find().sort({ name: 1 })
  }

  /**
   * Lấy danh mục theo ID
   */
  public async getCategoryById(categoryId: string): Promise<CourseCategoryDB> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new HttpException(400, 'COURSE_CATEGORY.INVALID_ID')
    }

    const category = await CourseCategoryModel.findById(categoryId)

    if (!category) {
      throw new HttpException(404, 'COURSE_CATEGORY.NOT_FOUND')
    }

    return category
  }

  /**
   * Cập nhật danh mục
   */
  public async updateCategory(categoryId: string, updateData: Partial<CourseCategoryDB>): Promise<CourseCategoryDB> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new HttpException(400, 'COURSE_CATEGORY.INVALID_ID')
    }

    const updatedCategory = await CourseCategoryModel.findByIdAndUpdate(
      categoryId,
      updateData,
      { new: true },
    )

    if (!updatedCategory) {
      throw new HttpException(404, 'COURSE_CATEGORY.NOT_FOUND')
    }

    return updatedCategory
  }

  /**
   * Xóa danh mục
   */
  public async deleteCategory(categoryId: string): Promise<void> {
    if (!Types.ObjectId.isValid(categoryId)) {
      throw new HttpException(400, 'COURSE_CATEGORY.INVALID_ID')
    }

    const result = await CourseCategoryModel.findByIdAndDelete(categoryId)
    if (!result) {
      throw new HttpException(404, 'COURSE_CATEGORY.NOT_FOUND')
    }
  }
}
