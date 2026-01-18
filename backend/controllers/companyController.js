const companyRepository = require("../Model/repository/companyRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const path = require("path");
const fs = require("fs").promises;

// Helper function to handle file uploads
const handleFileUpload = async (file, companyId, fileType) => {
  if (!file) return null;

  const uploadDir = path.join(__dirname, "../Uploads/companies", companyId.toString());
  await fs.mkdir(uploadDir, { recursive: true });

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);

  await fs.writeFile(filePath, file.buffer);

  return {
    file_name: fileName,
    original_name: file.originalname,
    file_path: filePath,
    file_size: file.size,
    mime_type: file.mimetype,
    file_type: fileType,
    company_id: companyId,
  };
};

// Get company by ID
exports.getCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  console.log('Getting company with ID:', id);
  
  const company = await companyRepository.findById(id, {
    includeAttachments: true,
    includeAccounts: true,
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  console.log('Company found:', company.toJSON());

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

// Get current company (from authenticated user)
exports.getCurrentCompany = catchAsync(async (req, res) => {
  // Assuming company ID is stored in req.user.companyId
  const companyId = req.user?.companyId || 1; // Default to 1 for now
  
  console.log('Getting current company with ID:', companyId);
  
  const company = await companyRepository.findById(companyId, {
    includeAttachments: true,
    includeAccounts: true,
  });

  if (!company) {
    throw new AppError("Company not found", 404);
  }

  console.log('Current company found:', company.toJSON());

  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});

// Create new company
exports.createCompany = catchAsync(async (req, res) => {
  const companyData = req.body;
  
  console.log('Creating company with data:', companyData);
  
  // Check if company with same email exists
  if (companyData.email) {
    const existingCompany = await companyRepository.findByEmail(companyData.email);
    if (existingCompany) {
      throw new AppError("Company with this email already exists", 400);
    }
  }

  // Check if company with same commercial register exists
  if (companyData.commercialRegistrationNumber) {
    const existingCompany = await companyRepository.findByCommercialRegister(
      companyData.commercialRegistrationNumber
    );
    if (existingCompany) {
      throw new AppError("Company with this commercial register already exists", 400);
    }
  }

  // Check if company with same tax number exists
  if (companyData.taxRegistrationNumber) {
    const existingCompany = await companyRepository.findByTaxNumber(
      companyData.taxRegistrationNumber
    );
    if (existingCompany) {
      throw new AppError("Company with this tax number already exists", 400);
    }
  }

  const company = await companyRepository.create(companyData);
  
  console.log('Company created:', company.toJSON());

  res.status(201).json({
    status: "success",
    data: {
      company,
    },
  });
});

// Update company
exports.updateCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  console.log('Updating company with ID:', id);
  console.log('Update data:', updateData);
  
  // Check if company exists
  const existingCompany = await companyRepository.findById(id);
  if (!existingCompany) {
    throw new AppError("Company not found", 404);
  }

  // Check for duplicate email if updating
  if (updateData.email && updateData.email !== existingCompany.email) {
    const companyWithEmail = await companyRepository.findByEmail(updateData.email);
    if (companyWithEmail && companyWithEmail.id !== parseInt(id)) {
      throw new AppError("Company with this email already exists", 400);
    }
  }

  // Check for duplicate commercial register if updating
  if (updateData.commercialRegistrationNumber && 
      updateData.commercialRegistrationNumber !== existingCompany.commercialRegistrationNumber) {
    const companyWithCR = await companyRepository.findByCommercialRegister(
      updateData.commercialRegistrationNumber
    );
    if (companyWithCR && companyWithCR.id !== parseInt(id)) {
      throw new AppError("Company with this commercial register already exists", 400);
    }
  }

  // Check for duplicate tax number if updating
  if (updateData.taxRegistrationNumber && 
      updateData.taxRegistrationNumber !== existingCompany.taxRegistrationNumber) {
    const companyWithTax = await companyRepository.findByTaxNumber(
      updateData.taxRegistrationNumber
    );
    if (companyWithTax && companyWithTax.id !== parseInt(id)) {
      throw new AppError("Company with this tax number already exists", 400);
    }
  }

  const updatedCompany = await companyRepository.update(id, updateData);
  
  console.log('Company updated:', updatedCompany.toJSON());

  res.status(200).json({
    status: "success",
    data: {
      company: updatedCompany,
    },
  });
});

// Delete company
exports.deleteCompany = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  console.log('Deleting company with ID:', id);
  
  await companyRepository.delete(id);
  
  console.log('Company deleted successfully');

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get company attachments
exports.getCompanyAttachments = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { fileType } = req.query;
  
  console.log('Getting attachments for company ID:', id, 'file type:', fileType);
  
  const attachments = await companyRepository.getAttachments(parseInt(id), fileType);
  
  console.log('Attachments found:', attachments.length);

  res.status(200).json({
    status: "success",
    data: {
      attachments,
    },
  });
});

// Upload company attachment
exports.uploadAttachment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { fileType } = req.body;
  
  console.log('Uploading attachment for company ID:', id, 'file type:', fileType);
  
  if (!req.file) {
    throw new AppError("No file uploaded", 400);
  }

  if (!fileType) {
    throw new AppError("File type is required", 400);
  }

  // Check if company exists
  const company = await companyRepository.findById(id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  const attachmentData = await handleFileUpload(req.file, parseInt(id), fileType);
  const attachment = await companyRepository.addAttachment(attachmentData);
  
  console.log('Attachment uploaded:', attachment.toJSON());

  res.status(201).json({
    status: "success",
    data: {
      attachment,
    },
  });
});

// Delete company attachment
exports.deleteAttachment = catchAsync(async (req, res) => {
  const { id, attachmentId } = req.params;
  
  console.log('Deleting attachment ID:', attachmentId, 'for company ID:', id);
  
  // Check if company exists
  const company = await companyRepository.findById(id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  await companyRepository.deleteAttachment(parseInt(attachmentId));
  
  console.log('Attachment deleted successfully');

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get company account
exports.getCompanyAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  
  console.log('Getting account for company ID:', id);
  
  const account = await companyRepository.getAccount(parseInt(id));
  
  if (!account) {
    throw new AppError("Company account not found", 404);
  }
  
  console.log('Account found:', account.toJSON());

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

// Create or update company account
exports.upsertCompanyAccount = catchAsync(async (req, res) => {
  const { id } = req.params;
  const accountData = req.body;
  
  console.log('Upserting account for company ID:', id);
  console.log('Account data:', accountData);
  
  // Check if company exists
  const company = await companyRepository.findById(id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // Hash password if provided
  if (accountData.password) {
    accountData.password_hash = await bcrypt.hash(accountData.password, 12);
    delete accountData.password;
  }

  accountData.company_id = parseInt(id);
  
  const account = await companyRepository.upsertAccount(accountData);
  
  console.log('Account upserted:', account.toJSON());

  res.status(200).json({
    status: "success",
    data: {
      account,
    },
  });
});

// Update company account password
exports.updateAccountPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  
  console.log('Updating password for company ID:', id);
  
  if (!currentPassword || !newPassword) {
    throw new AppError("Current password and new password are required", 400);
  }

  // Check if company exists
  const company = await companyRepository.findById(id);
  if (!company) {
    throw new AppError("Company not found", 404);
  }

  // Get current account
  const account = await companyRepository.getAccount(parseInt(id));
  if (!account) {
    throw new AppError("Company account not found", 404);
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(currentPassword, account.password_hash);
  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 400);
  }

  // Hash new password
  const newPasswordHash = await bcrypt.hash(newPassword, 12);
  
  await companyRepository.updatePassword(parseInt(id), newPasswordHash);
  
  console.log('Password updated successfully');

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

// Get all companies (admin only)
exports.getAllCompanies = catchAsync(async (req, res) => {
  const { page = 1, limit = 100000000, search, status } = req.query;
  
  console.log('Getting all companies with filters:', { page, limit, search, status });
  
  const result = await companyRepository.findAll({
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    status,
    includeAttachments: false,
    includeAccounts: false,
  });
  
  console.log('Companies found:', result.companies.length, 'Total:', result.total);

  res.status(200).json({
    status: "success",
    data: result,
  });
});
