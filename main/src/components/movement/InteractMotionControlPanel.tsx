import React, { useState } from 'react';

interface InteractMotionControlPanelProps {
  onMotionParamsChange: (params: InteractMotionParams) => void;
  isVisible: boolean;
  onToggle: () => void;
}

export interface InteractMotionParams {
  speedBase: number;
  followSpeedMultiplier: number;
  followSpeedOffset: number;
  colorInterpolationPower: number;
  floatAmplitude: number;
  floatSpeed: number;
  tiltSensitivity: number;
  hoverScale: number;
  shadowIntensity: number;
  borderRadiusOuter: number;
  gyroSensitivity: number;
}

export function InteractMotionControlPanel({ onMotionParamsChange, isVisible, onToggle }: InteractMotionControlPanelProps) {
  const [params, setParams] = useState<InteractMotionParams>({
    speedBase: 0.08,              // 마우스/자이로 반응 속도
    followSpeedMultiplier: 0.4,   // 팔로우 속도 배수
    followSpeedOffset: 1.0,       // 팔로우 속도 오프셋
    colorInterpolationPower: 0.9, // 컬러 보간 곡선
    floatAmplitude: 15,           // 부유 진폭
    floatSpeed: 0.02,             // 부유 속도
    tiltSensitivity: 15,          // 틸트 감도
    hoverScale: 1.08,             // 호버 시 확대 비율
    shadowIntensity: 1.0,         // 그림자 강도
    borderRadiusOuter: 8,         // 바깥 사각형 모서리 둥글기
    gyroSensitivity: 1.0,         // 자이로스코프 감도
  });

  const handleParamChange = (key: keyof InteractMotionParams, value: number) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onMotionParamsChange(newParams);
  };

  const resetToDefault = () => {
    const defaultParams: InteractMotionParams = {
      speedBase: 0.08,
      followSpeedMultiplier: 0.4,
      followSpeedOffset: 1.0,
      colorInterpolationPower: 0.9,
      floatAmplitude: 15,
      floatSpeed: 0.02,
      tiltSensitivity: 15,
      hoverScale: 1.08,
      shadowIntensity: 1.0,
      borderRadiusOuter: 8,
      gyroSensitivity: 1.0,
    };
    setParams(defaultParams);
    onMotionParamsChange(defaultParams);
  };

  const copyParams = () => {
    const paramsString = JSON.stringify(params, null, 2);
    navigator.clipboard.writeText(paramsString);
    alert('Parameters copied to clipboard!');
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
      >
        {isVisible ? '3D 모션 패널 닫기' : '3D 모션 패널 열기'}
      </button>

      {/* Control Panel */}
      {isVisible && (
        <div className="fixed top-16 right-4 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-40 max-h-[80vh] overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">컨트롤 패널</h3>
          </div>

          <div className="p-4 space-y-4">
            {/* Response Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Response Speed: {params.speedBase.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.01"
                max="0.3"
                step="0.005"
                value={params.speedBase}
                onChange={(e) => handleParamChange('speedBase', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>느림 (0.01)</span>
                <span>빠름 (0.3)</span>
              </div>
            </div>

            {/* Follow Speed Multiplier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Follow Connection: {params.followSpeedMultiplier.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="2.0"
                step="0.05"
                value={params.followSpeedMultiplier}
                onChange={(e) => handleParamChange('followSpeedMultiplier', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>독립적 (0.1)</span>
                <span>강한 연결 (2.0)</span>
              </div>
            </div>

            {/* Float Amplitude */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Float Amplitude: {params.floatAmplitude.toFixed(1)}px
              </label>
              <input
                type="range"
                min="0"
                max="50"
                step="1"
                value={params.floatAmplitude}
                onChange={(e) => handleParamChange('floatAmplitude', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>정적 (0)</span>
                <span>큰 움직임 (50)</span>
              </div>
            </div>

            {/* Float Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Float Speed: {params.floatSpeed.toFixed(3)}
              </label>
              <input
                type="range"
                min="0.005"
                max="0.1"
                step="0.005"
                value={params.floatSpeed}
                onChange={(e) => handleParamChange('floatSpeed', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>느림 (0.005)</span>
                <span>빠름 (0.1)</span>
              </div>
            </div>

            {/* Tilt Sensitivity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tilt Sensitivity: {params.tiltSensitivity.toFixed(1)}°
              </label>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={params.tiltSensitivity}
                onChange={(e) => handleParamChange('tiltSensitivity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>평면 (0)</span>
                <span>역동적 (45)</span>
              </div>
            </div>

            {/* Gyro Sensitivity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gyro Sensitivity: {params.gyroSensitivity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.gyroSensitivity}
                onChange={(e) => handleParamChange('gyroSensitivity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>둔감 (0.1)</span>
                <span>민감 (3.0)</span>
              </div>
            </div>

            {/* Hover Scale */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hover Scale: {params.hoverScale.toFixed(2)}x
              </label>
              <input
                type="range"
                min="1.0"
                max="1.3"
                step="0.01"
                value={params.hoverScale}
                onChange={(e) => handleParamChange('hoverScale', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>그대로 (1.0)</span>
                <span>확대 (1.3)</span>
              </div>
            </div>

            {/* Shadow Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shadow Intensity: {params.shadowIntensity.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.1"
                value={params.shadowIntensity}
                onChange={(e) => handleParamChange('shadowIntensity', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>없음 (0.0)</span>
                <span>진함 (3.0)</span>
              </div>
            </div>

            {/* Color Interpolation Power */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color Curve: {params.colorInterpolationPower.toFixed(2)}
              </label>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={params.colorInterpolationPower}
                onChange={(e) => handleParamChange('colorInterpolationPower', parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Linear (0.1)</span>
                <span>Curved (3.0)</span>
              </div>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Border Radius: {params.borderRadiusOuter}px
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={params.borderRadiusOuter}
                onChange={(e) => handleParamChange('borderRadiusOuter', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>사각형 (0)</span>
                <span>둥글게 (30)</span>
              </div>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <button
              onClick={resetToDefault}
              className="flex-1 bg-gray-600 text-white py-2 px-3 rounded hover:bg-gray-700 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={copyParams}
              className="flex-1 bg-green-600 text-white py-2 px-3 rounded hover:bg-green-700 transition-colors text-sm"
            >
              Copy Values
            </button>
          </div>

          {/* Current Values Display */}
          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Values:</h4>
            <pre className="text-xs bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(params, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </>
  );
}