import type { CourseCategory, SuccessResponseBody } from '@shared/types'
import type { Request, RequestHandler, Response } from 'express'
import { CourseCategoryService } from '@services/courseCategory.service'
import { asyncHandler } from '@utils/asyncHandler'
import { inject, injectable } from 'tsyringe'

@injectable()
export class CourseCategoryController {
  constructor(
    @inject(CourseCategoryService) private courseCategoryService: CourseCategoryService,
  ) {}

  /**
   * Tạo danh mục mới
   */
  public createCategory: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const categoryData = req.body
    const newCategory = await this.courseCategoryService.createCategory(categoryData)

    res.status(201).json({
      success: true,
      message: 'COURSE_CATEGORY.CREATED',
      data: {
        _id: newCategory._id?.toString(),
        name: newCategory.name,
        description: newCategory.description,
        createdAt: newCategory.createdAt,
      },
    } as SuccessResponseBody<CourseCategory>)
  })

  /**
   * Lấy tất cả danh mục
   */
  public getAllCategories: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const categories = await this.courseCategoryService.getAllCategories()
    const response = categories.map(cat => ({
      _id: cat._id?.toString(),
      name: cat.name,
      description: cat.description,
      createdAt: cat.createdAt,
    }))

    res.status(200).json({
      success: true,
      message: 'COURSE_CATEGORY.FOUND',
      data: response,
    } as SuccessResponseBody<CourseCategory[]>)
  })

  /**
   * Lấy danh mục theo ID
   */
  public getCategoryById: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const category = await this.courseCategoryService.getCategoryById(id)

    res.status(200).json({
      success: true,
      message: 'COURSE_CATEGORY.FOUND',
      data: {
        _id: category._id?.toString(),
        name: category.name,
        description: category.description,
        createdAt: category.createdAt,
      },
    } as SuccessResponseBody<CourseCategory>)
  })

  /**
   * Cập nhật danh mục
   */
  public updateCategory: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const updateData = req.body
    const updatedCategory = await this.courseCategoryService.updateCategory(id, updateData)

    res.status(200).json({
      success: true,
      message: 'COURSE_CATEGORY.UPDATED',
      data: {
        _id: updatedCategory._id?.toString(),
        name: updatedCategory.name,
        description: updatedCategory.description,
        createdAt: updatedCategory.createdAt,
      },
    } as SuccessResponseBody<CourseCategory>)
  })

  /**
   * Xóa danh mục
   */
  public deleteCategory: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    await this.courseCategoryService.deleteCategory(id)

    res.status(200).json({
      success: true,
      message: 'COURSE_CATEGORY.DELETED',
    } as SuccessResponseBody<null>)
  })
}
