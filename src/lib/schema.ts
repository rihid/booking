import { z } from "zod";

// Form Schema
export const LoginFormSchema = z.object({
  username: z.string({
    message: "Password is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  })
});

// api rerponse Schema
export const AuthSchema = z.object({
  token: z.string(),
  kong: z.object({
    rsa_public_key: z.string().nullable(),
    tags: z.string().nullable(),
    id: z.string(),
    algorithm: z.string(),
    created_at: z.number().nullable(),
    secret: z.string(),
    key: z.string(),
    consumer: z.object({ id: z.string() })
  })
})
export const UserTokenSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable(),
  email: z.string(),
  org_no: z.string().nullable(),
  type: z.string().nullable(),
  avatar: z.optional(z.string().nullable()),
  greetings: z.string().nullable(),
  role: z.array(z.string()).nullable(),
  permission: z.any().nullable(),
  customer_no: z.string().nullable(),
});

export const ProductSchema = z.object({
  id: z.string(),
  product_no: z.string(),
  product_name: z.string(),
  product_description: z.string().nullable(),
  product_about: z.string().nullable(),
  type_id: z.string(),
  type: z.string().nullable(),
  category_id: z.string(),
  category: z.string(),
  active: z.boolean(),
  is_serial_number: z.boolean(),
  costing_method: z.string().nullable(),
  costing_evaluation: z.string().nullable(),
  uom_id: z.string().nullable(),
  uom: z.string(),
  org_no: z.string(),
  is_variant: z.boolean(),
  can_be_sold: z.boolean(),
  cogs: z.boolean(),
  multiple_uom: z.boolean(),
  is_asset: z.boolean(),
  duration_trip: z.string().nullable(),
  price: z.string(),
  variant: z.string().nullable(),
  location_id: z.string().nullable(),
  location: z.string().nullable(),
  uoms: z.array(z.any()),
  variants: z.array(z.object({
    id: z.string(),
    variant_name: z.string(),
    product_no: z.string(),
    product_sku: z.string().nullable(),
    notes: z.string().nullable(),
    org_no: z.string(),
    active: z.boolean(),
    created_at: z.string().nullable(),
    updated_at: z.string().nullable(),
    branch_no: z.string().nullable(),
  })),
  amenities: z.array(z.object({
    id: z.string(),
    product_no: z.string(),
    amentity_id: z.string().nullable(),
    org_no: z.string().nullable(),
    branch_no: z.string().nullable()
  })),
});

export const SingleProductSchema = z.object({
  id: z.string(),
  product_no: z.string(),
  product_name: z.string(),
  product_description: z.string().nullable(),
  product_about: z.string().nullable(),
  type_id: z.string(),
  category_id: z.string(),
  active: z.boolean(),
  is_serial_number: z.boolean(),
  costing_method: z.string().nullable(),
  costing_evaluation: z.string().nullable(),
  uom_id: z.string().nullable(),
  org_no: z.string().nullable(),
  prices: z.array(
    z.object({
      id: z.string(),
      product_no: z.string(),
      product_sku: z.string().nullable(),
      price_date: z.string(),
      uom_id: z.string().nullable(),
      amount: z.string(),
      notes: z.string().nullable()
    })),
  is_variant: z.boolean(),
  is_guided: z.boolean(),
  can_be_sold: z.boolean(),
  cogs: z.boolean(),
  multiple_uom: z.boolean(),
  is_asset: z.boolean(),
  duration_trip: z.string().nullable(),
  location_id: z.string().nullable(),
  location: z.string().nullable(),
  routes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      longitude: z.string().nullable(),
      latitude: z.string().nullable(),
      org_no: z.string().nullable(),
      branch_no: z.string().nullable(),
    })
  ),
  sell_price: z.string(),
  sell_date: z.string().nullable(),
  uoms: z.array(z.any()),
  variants: z.array(
    z.object({
      id: z.string().nullable(),
      variant_name: z.string().nullable(),
      product_sku: z.string().nullable(),
      notes: z.string().nullable(),
      org_no: z.string().nullable(),
      active: z.boolean(),
      price: z.string().nullable(),
      prices: z.array(
        z.object({
          id: z.string(),
          product_no: z.string(),
          product_sku: z.string().nullable(),
          price_date: z.string(),
          uom_id: z.string().nullable(),
          amount: z.string().nullable(),
          notes: z.string().nullable(),
          active: z.boolean(),
          created_at: z.string().nullable(),
          updated_at: z.string().nullable()
        })
      ).nullable()
    }),
  ).nullable(),
  addons: z.array(z.any()),
  amenities: z.array(
    z.object({
      id: z.string(),
      product_no: z.string(),
      amentity_id: z.string().nullable(),
      amenity: z.string(),
      org_no: z.string().nullable(),
      queue: z.number().nullable(),
      branch_no: z.string().nullable()
    })
  ),
  pictures: z.array(
    z.object({
      id: z.string(),
      product_no: z.string(),
      filename: z.string(),
      mime_type: z.string(),
      extension: z.string(),
      type: z.string(),
      size: z.string(),
      disk: z.string(),
      org_no: z.string(),
      branch_no: z.string().nullable(),
      url: z.string()
    })
  )
});