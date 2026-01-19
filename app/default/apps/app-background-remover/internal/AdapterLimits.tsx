interface AdapterLimitsProps {
	limits: any;
}

export function AdapterLimits({ limits }: AdapterLimitsProps) {
	if (!limits) {
		return null;
	}

	return (
		<div className="mt-4 pt-4 border-t border-gray-200">
			<h4 className="font-semibold text-gray-800 mb-3 text-sm">Limits</h4>
			<div className="grid grid-cols-2 gap-2 text-xs">
				{limits.maxTextureDimension1D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 1D: </span>
						<span className="text-gray-900">{limits.maxTextureDimension1D.toLocaleString()}</span>
					</div>
				)}
				{limits.maxTextureDimension2D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 2D: </span>
						<span className="text-gray-900">{limits.maxTextureDimension2D.toLocaleString()}</span>
					</div>
				)}
				{limits.maxTextureDimension3D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 3D: </span>
						<span className="text-gray-900">{limits.maxTextureDimension3D.toLocaleString()}</span>
					</div>
				)}
				{limits.maxTextureArrayLayers !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture Array Layers: </span>
						<span className="text-gray-900">{limits.maxTextureArrayLayers.toLocaleString()}</span>
					</div>
				)}
				{limits.maxBindGroups !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Bind Groups: </span>
						<span className="text-gray-900">{limits.maxBindGroups.toLocaleString()}</span>
					</div>
				)}
				{limits.maxUniformBuffersPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Uniform Buffers/Stage: </span>
						<span className="text-gray-900">{limits.maxUniformBuffersPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{limits.maxStorageBuffersPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Buffers/Stage: </span>
						<span className="text-gray-900">{limits.maxStorageBuffersPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{limits.maxSampledTexturesPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Sampled Textures/Stage: </span>
						<span className="text-gray-900">{limits.maxSampledTexturesPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{limits.maxStorageTexturesPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Textures/Stage: </span>
						<span className="text-gray-900">{limits.maxStorageTexturesPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{limits.maxUniformBufferBindingSize !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Uniform Buffer Size: </span>
						<span className="text-gray-900">{(limits.maxUniformBufferBindingSize / 1024 / 1024).toFixed(2)} MB</span>
					</div>
				)}
				{limits.maxStorageBufferBindingSize !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Buffer Size: </span>
						<span className="text-gray-900">{(limits.maxStorageBufferBindingSize / 1024 / 1024).toFixed(2)} MB</span>
					</div>
				)}
				{limits.maxComputeWorkgroupSizeX !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup X: </span>
						<span className="text-gray-900">{limits.maxComputeWorkgroupSizeX.toLocaleString()}</span>
					</div>
				)}
				{limits.maxComputeWorkgroupSizeY !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup Y: </span>
						<span className="text-gray-900">{limits.maxComputeWorkgroupSizeY.toLocaleString()}</span>
					</div>
				)}
				{limits.maxComputeWorkgroupSizeZ !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup Z: </span>
						<span className="text-gray-900">{limits.maxComputeWorkgroupSizeZ.toLocaleString()}</span>
					</div>
				)}
				{limits.maxComputeInvocationsPerWorkgroup !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Invocations: </span>
						<span className="text-gray-900">{limits.maxComputeInvocationsPerWorkgroup.toLocaleString()}</span>
					</div>
				)}
			</div>
		</div>
	);
}
