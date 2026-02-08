// biome-ignore lint/suspicious/noExplicitAny: We don't know the type of the GPUAdapterLimits
type GPUAdapterLimits = any;

interface AdapterLimitsProps {
	limits: GPUAdapterLimits;
}

export function AdapterLimits(props: AdapterLimitsProps) {
	if (!props.limits) {
		return null;
	}

	return (
		<div className="mt-4 border-gray-200 border-t pt-4">
			<h4 className="mb-3 font-semibold text-gray-800 text-sm">Limits</h4>
			<div className="grid grid-cols-2 gap-2 text-xs">
				{props.limits.maxTextureDimension1D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 1D: </span>
						<span className="text-gray-900">{props.limits.maxTextureDimension1D.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxTextureDimension2D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 2D: </span>
						<span className="text-gray-900">{props.limits.maxTextureDimension2D.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxTextureDimension3D !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture 3D: </span>
						<span className="text-gray-900">{props.limits.maxTextureDimension3D.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxTextureArrayLayers !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Texture Array Layers: </span>
						<span className="text-gray-900">{props.limits.maxTextureArrayLayers.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxBindGroups !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Bind Groups: </span>
						<span className="text-gray-900">{props.limits.maxBindGroups.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxUniformBuffersPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Uniform Buffers/Stage: </span>
						<span className="text-gray-900">{props.limits.maxUniformBuffersPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxStorageBuffersPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Buffers/Stage: </span>
						<span className="text-gray-900">{props.limits.maxStorageBuffersPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxSampledTexturesPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Sampled Textures/Stage: </span>
						<span className="text-gray-900">{props.limits.maxSampledTexturesPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxStorageTexturesPerShaderStage !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Textures/Stage: </span>
						<span className="text-gray-900">{props.limits.maxStorageTexturesPerShaderStage.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxUniformBufferBindingSize !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Uniform Buffer Size: </span>
						<span className="text-gray-900">
							{(props.limits.maxUniformBufferBindingSize / 1024 / 1024).toFixed(2)} MB
						</span>
					</div>
				)}
				{props.limits.maxStorageBufferBindingSize !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Storage Buffer Size: </span>
						<span className="text-gray-900">
							{(props.limits.maxStorageBufferBindingSize / 1024 / 1024).toFixed(2)} MB
						</span>
					</div>
				)}
				{props.limits.maxComputeWorkgroupSizeX !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup X: </span>
						<span className="text-gray-900">{props.limits.maxComputeWorkgroupSizeX.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxComputeWorkgroupSizeY !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup Y: </span>
						<span className="text-gray-900">{props.limits.maxComputeWorkgroupSizeY.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxComputeWorkgroupSizeZ !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Workgroup Z: </span>
						<span className="text-gray-900">{props.limits.maxComputeWorkgroupSizeZ.toLocaleString()}</span>
					</div>
				)}
				{props.limits.maxComputeInvocationsPerWorkgroup !== undefined && (
					<div>
						<span className="font-medium text-gray-600">Max Compute Invocations: </span>
						<span className="text-gray-900">{props.limits.maxComputeInvocationsPerWorkgroup.toLocaleString()}</span>
					</div>
				)}
			</div>
		</div>
	);
}
